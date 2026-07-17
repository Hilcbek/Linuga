# Stream Audio Lesson Integration

> A future-facing implementation guide for the Lingua audio lesson feature.
>
> Scope: the audio lesson UI from `prompts/12-audio-lesson-ui.md` plus the authenticated Stream integration from `prompts/13-stream-integration.md`.

## 1. What this feature does

The feature lets an authenticated learner open any lesson, obtain a short-lived Stream user token, create an audio-only Stream call for that lesson, join it, mute or unmute the microphone, observe connection state, retry failures, and leave the session.

The feature deliberately keeps three concerns separate:

1. The mobile UI owns lesson presentation and temporary interaction state.
2. Expo API routes own authentication, Stream secrets, token generation, and authoritative call creation.
3. Stream owns realtime audio transport, microphone state, participants, reconnection, and call lifecycle.

This is an important boundary. The mobile app may know the public Stream API key and its own short-lived user token, but it must never receive the Stream API secret or decide which Stream user identity it is allowed to impersonate.

### Current functional scope

- Clerk-authenticated token exchange.
- Server-side Stream user upsert.
- Server-side `audio_room` call creation.
- Lesson and language validation before call creation.
- Audio-only join flow.
- Real microphone mute/unmute.
- Participant count and microphone state observation.
- Loading, connecting, joined, muted, error, reconnecting, and ended UI states.
- Retry and cleanup behavior.
- Mobile-native implementation with a safe web fallback.

### Deliberate non-goals

- The AI teacher does not yet speak through Stream or a Vision/AI agent.
- The Audio button currently advances local hardcoded lesson phrases; it is not text-to-speech playback.
- Speaking, pronunciation, and grammar scores are presentation placeholders.
- No call recording, transcription, push ringing, background call, or screen sharing is enabled.
- The learner preview is a profile image, not a camera stream.

## 2. Architecture at a glance

```text
Lesson card
   |  push /audio-lesson?lessonId=...
   v
AudioLessonRoute
   |-- SafeAreaProvider
   |-- StreamVideoProvider
   |     |-- GET /api/stream/token + Clerk bearer token
   |     |-- verify Clerk session on server
   |     |-- create 4-hour Stream token
   |     `-- create singleton StreamVideoClient
   `-- AudioLessonScreen
         |-- POST /api/stream/audio-call + lesson/language/request id
         |-- validate Clerk user + learning data on server
         |-- getOrCreate audio_room call
         |-- client.call(type, id, { reuseInstance: true })
         |-- call.join()
         |-- microphone.toggle()
         `-- call.leave() on end/unmount
```

### Why there are two API routes

`/api/stream/token` and `/api/stream/audio-call` solve different trust-boundary problems.

- The token route establishes the realtime Stream client identity. It returns the public API key, a short-lived token, and the server-derived user id.
- The call route authorizes and creates a lesson-specific call. It validates that the lesson and language actually exist and embeds trusted lesson metadata in the Stream call.

Combining both into one route would couple client connection lifetime to one lesson call. Keeping them separate allows the Stream client token to refresh independently and keeps call creation explicit.

## 3. Request and lifecycle sequence

1. A lesson card pushes the root `/audio-lesson` route with only `lessonId`.
2. Expo Router allows the route only when Clerk is signed in and a language has been selected.
3. `StreamVideoProvider` asks Clerk for the current session token.
4. The provider sends that token as `Authorization: Bearer ...` to `/api/stream/token`.
5. The server verifies the Clerk JWT and derives `claims.sub`; the client never submits a Stream user id.
6. The server reads the Stream key and secret, upserts the Clerk user in Stream, and returns a four-hour Stream user token.
7. The provider creates or reuses the singleton `StreamVideoClient` and mounts `StreamVideo`.
8. The audio lesson screen generates a UUID request id and calls `/api/stream/audio-call`.
9. The server verifies Clerk again, validates the lesson/language pair, and derives `lesson-<uuid>` as the call id.
10. The server uses `getOrCreate` for an `audio_room`, assigns the current user as host, disables backstage for this teaching flow, and keeps the call audio-only.
11. The mobile screen retrieves the same call using `{ reuseInstance: true }`, joins it, disables the camera defensively, and enables the microphone.
12. Stream hooks report calling state, participant count, microphone status, and speaking-while-muted state.
13. End Lesson calls `leave()`. Unmount cleanup also calls `leave()` only when the call has not already left.

## 4. Security model

### Public values

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is intentionally available in the Expo bundle.
- The Stream API key is public and is returned by the token route to initialize the client.

### Server-only values

- `CLERK_SECRET_KEY` is used only by Expo API route code.
- `STREAM_API_SECRET` is used only by `@stream-io/node-sdk` in server code.
- Neither secret is imported into native components, Expo config, route parameters, or response bodies.

### Identity rule

The server always derives the Stream user id from the verified Clerk token subject. A body such as `{ userId: "someone-else" }` is never accepted. This prevents a signed-in learner from minting a Stream token for another user.

### Environment template

`.env.example` contains placeholders only:

```dotenv
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
CLERK_SECRET_KEY=sk_test_replace_me
STREAM_API_KEY=replace_me
STREAM_API_SECRET=replace_me
```

Real values belong in the ignored `.env` file. If a real secret is ever committed, pasted into chat, or included in an example file, rotate it in the Clerk or Stream dashboard; deleting it from the latest commit does not erase it from Git history.

## 5. File-by-file explanation

### 5.1 Routes and navigation

#### `app/audio-lesson.tsx` — root lesson route

This route composes the infrastructure needed by the feature:

- `GestureHandlerRootView` supplies the native gesture root expected by Stream and related native UI.
- `SafeAreaProvider` supplies device insets.
- `StreamVideoProvider` owns the Stream client lifecycle.
- `AudioLessonScreen` owns the lesson and call UI.

The provider is route-local rather than app-global. That keeps WebRTC and its socket disconnected while users browse unrelated screens, reduces startup work, and limits native SDK failures to the feature that needs it. It also ensures Clerk remains the outer application provider in `app/_layout.tsx`.

#### `app/_layout.tsx` — protected root registration

The root stack registers `audio-lesson` inside both guards:

- the user must be signed in;
- a language must already be selected.

The route sits beside `(tabs)`, not inside it. An audio session is an immersive task and should not behave like another permanent tab. Keeping `ClerkProvider` at the root is essential because `StreamVideoProvider`, `AudioLessonScreen`, and API authorization all depend on Clerk hooks.

#### `app/(tabs)/audio-lesson.tsx` — removed

The original hidden tab route was deleted. A hidden tab still belongs to the tab navigator and caused route-registration warnings and confusing tab history. Moving the screen to the root stack produces a clean full-screen lesson flow.

#### `app/(tabs)/_layout.tsx` — tab cleanup

The hidden `audio-lesson` tab declaration was removed because the route no longer lives under `(tabs)`. The five actual product tabs remain explicit.

#### `components/lessons-screen.tsx` — lesson entry points

Lesson cards and the primary Start button push:

```ts
{
  pathname: '/audio-lesson',
  params: { lessonId },
}
```

Only the lesson id crosses the navigation boundary. Full lesson objects are not passed through router params because they are larger, can become stale, and are not authoritative. The destination resolves the current typed lesson from `data/lessons.ts`.

The `push` behavior intentionally creates a new stack entry so Back returns to the exact lessons state.

#### `components/bottom-tab-bar.tsx` — immersive-screen safeguard

The tab bar returns `null` for `/audio-lesson`. The root-stack move normally means the tab bar is not mounted there, but this check is a defensive safeguard if route composition changes later. The Learn tab is no longer marked active for the audio route because the route is outside the tab navigator.

### 5.2 Platform boundaries

#### `components/audio-lesson-screen.tsx` — platform selector

This is a small public facade. App code imports one stable module path, while the facade selects:

- `audio-lesson-screen.native.tsx` on iOS and Android;
- `audio-lesson-screen.web.tsx` on web and server rendering.

The native module is loaded through a guarded `require`. A normal top-level import would cause Metro's web/server bundle to evaluate the Stream React Native SDK and WebRTC native module, producing `WebRTC native module not found` before the fallback UI could render.

The type-only import keeps the native and web exports aligned without executing the native module.

#### `components/stream-video-provider.tsx` — provider platform selector

This facade applies the same guarded-import design to the Stream provider and `useStreamVideoConnection` hook. It prevents the native Video SDK from entering Expo's web/API route evaluation graph.

#### `components/audio-lesson-screen.web.tsx` — web fallback

Web is intentionally not given a fake call implementation. The fallback explains that live lessons require the native mobile app and offers a Back button. This is preferable to partially emulating WebRTC behavior and creating two divergent call implementations.

#### `components/stream-video-provider.web.tsx` — web connection contract

The web provider preserves the same context shape but always reports an error state explaining that live audio is mobile-only. Consumers can render safely without importing native Stream types or modules at runtime.

### 5.3 Stream client provider

#### `components/stream-video-provider.native.tsx`

This file owns authentication-to-Stream connection state. Its responsibilities are intentionally narrower than the lesson screen:

- wait for Clerk to load and confirm the user is signed in;
- fetch a Stream session from the authenticated token route;
- map Clerk profile fields to the Stream `User` object;
- create the Stream singleton;
- mount `StreamVideo`;
- expose `idle`, `connecting`, `ready`, or `error`;
- expose an explicit retry action;
- disconnect on cleanup.

#### Why `getOrCreateInstance`

`StreamVideoClient.getOrCreateInstance` is used instead of `new StreamVideoClient`. Stream expects one client per signed-in identity. Multiple clients can duplicate sockets, fragment call state, and break future push/ringing behavior.

#### Why the token provider is supplied with the first token

The initial token avoids an extra request during startup. `tokenProvider` lets the SDK request a fresh four-hour token later when the first token expires.

#### Why Clerk callbacks are stored in refs

Clerk may return a new `getToken` function reference after a render. If that function is a connection effect dependency, the effect can enter this loop:

```text
request -> state update -> render -> new callback identity -> effect -> request
```

`getTokenRef` always points at the latest Clerk callback while the Stream token provider remains referentially stable. The effect depends on stable user primitives such as user id, image URL, and display name rather than the complete Clerk user object.

#### Safe-area theme bridge

Stream UI reads insets from its theme. `StreamVideoWithInsets` converts `useSafeAreaInsets()` into `theme.variants.insets`, making the provider compatible with Android edge-to-edge and iOS notches if Stream-provided call UI is added later.

### 5.4 Native lesson and call UI

#### `components/audio-lesson-screen.native.tsx`

This is the largest feature file because it combines the design-specific lesson presentation with the call controller.

##### Local UI components

- `AudioControl` standardizes the four circular controls, disabled state, accessibility, active colors, and destructive End Lesson styling.
- `CallStatusCard` gives every connection state a stable-height presentation. A fixed icon slot prevents layout shifting when the spinner becomes a status dot.
- `FeedbackItem` renders the static score row.
- `AudioCallStateObserver` is mounted inside `StreamCall`, where Stream hooks are legal, and reports a small serializable snapshot back to the screen.

##### Two state machines are merged

The screen receives provider state (`idle`, `connecting`, `ready`, `error`) and owns call state (`loading`, `connecting`, `joined`, `muted`, `error`, `ended`).

`visibleCallStatus` gives provider errors priority because a call cannot be healthy without a client. Once the provider is ready, the call-specific state drives the UI. This prevents contradictory labels such as a joined call while the provider reports an authentication failure.

##### Call creation

A UUID is created once per lesson attempt with `expo-crypto`. The server prefixes it with `lesson-`. Repeated effect execution for the same attempt reaches Stream's idempotent `getOrCreate` call rather than creating random rooms. An explicit retry generates a fresh UUID and therefore a fresh lesson session.

##### Singleton call handle

The screen calls:

```ts
client.call(callType, callId, { reuseInstance: true })
```

The call object is not passed through navigation and is not reconstructed by child components. This prevents duplicate SDK call objects for the same `(type, id)` pair.

##### Join and audio enforcement

After `join`, the screen disables the camera defensively and enables the microphone. The server also creates the room as audio-only, so the rule is enforced at both the trusted call configuration and device-controller levels.

##### Mute behavior

The Mic button calls `call.microphone.toggle()`. It does not merely flip React state. `AudioCallStateObserver` reads the SDK's optimistic microphone status and updates the visible joined/muted state.

##### End behavior

End Lesson uses `call.leave()`, not `endCall()`. `leave()` disconnects this learner; `endCall()` would terminate the shared room for everyone. The cleanup guard checks `CallingState.LEFT` so button handling, unmount cleanup, and React development behavior cannot leave the same call twice.

##### Status observation

The observer maps Stream states deliberately:

- `JOINED` -> joined or muted according to microphone state;
- joining, ringing, reconnecting, migrating, offline, idle -> connecting;
- `RECONNECTING_FAILED` -> actionable error;
- `LEFT` -> ended unless an error already owns the state.

The exhaustive switch includes a `never` check, making new Stream enum values visible during TypeScript upgrades.

##### Design decisions

- The existing playful teacher-room design remains intact instead of replacing it with generic Stream call UI.
- The learner's Clerk profile image and name personalize the preview and status card.
- Lesson title, language, duration, goal, phrase, translation, level, and XP all come from local typed data.
- Mic is disabled until a call is actually active.
- Subtitles and phrase playback remain local UI state because AI speech is outside the current milestone.
- The status card is outside the fixed visual stage so error text does not resize or destabilize the teacher layout.

### 5.5 Client-side API adapter

#### `lib/stream-api.ts`

This module is the only place native UI code knows the API route details.

- `getAuthorizationHeader` obtains a Clerk session token and rejects an expired local session before making a network request.
- `readApiError` normalizes JSON errors and falls back to HTTP status text.
- `fetchStreamSession` calls the token route.
- `createAudioLessonCall` posts lesson id, language id, and request id.

Centralizing this logic keeps fetch details, headers, response parsing, and user-facing errors out of the screen.

### 5.6 Server-side authentication and Stream access

#### `lib/server/clerk-auth.ts`

This module establishes the server trust boundary.

`requireClerkUserId` parses a Bearer token, verifies it, and returns only the verified subject. When `CLERK_SECRET_KEY` or `CLERK_JWT_KEY` exists, Clerk's backend verifier is used.

The publishable-key fallback derives the Clerk Frontend API host, downloads its JWKS, selects the JWT signing key by `kid`, verifies the signature, and pins the issuer. JWKS values are cached and refetched on an unknown key id so Clerk signing-key rotation can recover.

`ApiRouteError` represents intentional HTTP responses. `apiErrorResponse` distinguishes:

- validation/auth errors;
- missing or placeholder Stream configuration;
- Stream 401 credential rejection;
- unexpected service failures.

Detailed unexpected errors stay in server logs; clients receive a safe message without secrets or SDK internals.

#### `lib/server/stream.ts`

This is the only Stream server-client factory.

- Reads and trims the API key and secret.
- Accepts `STREAM_API_SECRET` as the canonical secret variable and `STREAM_SECRET` as a compatibility fallback.
- Accepts `EXPO_PUBLIC_STREAM_API_KEY` as a public-key fallback, although `STREAM_API_KEY` is preferred for this server setup.
- Rejects missing values, obvious placeholders, and identical key/secret values before making a remote request.
- Caches one `StreamClient` for the active credential pair.
- Recreates the client if development credentials change.

The secret remains captured only in server memory. `getStreamServer` returns the client and public API key, never the secret.

### 5.7 Expo API routes

#### `app/api/stream/token+api.ts`

This authenticated GET route:

1. verifies Clerk;
2. gets the server Stream client;
3. upserts the user with the verified Clerk subject;
4. generates a four-hour Stream user token;
5. returns `{ apiKey, token, userId }`.

Four hours is long enough for a lesson and short enough for automatic rotation to matter. The client token provider can call this route again without changing the Stream identity.

#### `app/api/stream/audio-call+api.ts`

This authenticated POST route is authoritative for room creation.

- Runtime-checks all body fields because TypeScript types do not validate network input.
- Requires a UUID request id.
- Resolves the lesson and language from server-owned hardcoded data.
- Rejects a mismatched lesson/language pair.
- Upserts the user so the route remains independently safe if called before token initialization.
- Creates `lesson-<uuid>` using Stream `getOrCreate`.
- Marks the authenticated learner as a host member.
- Stores lesson, language, and session-owner metadata in call custom data.
- Enables the speaker and microphone defaults.
- Disables backstage so a one-person teaching lesson can join immediately.
- Sends `video: false` for audio-only call signaling.

Do not re-add a partial `settings_override.video` object. The built-in `audio_room` call type already has video disabled. A partial override caused Stream to validate an implicit `0x0` target resolution and reject call creation because width and height must be at least 240.

### 5.8 Shared contracts

#### `types/stream.ts`

This file defines the two response contracts shared by UI and API adapter:

- `StreamSessionResponse` for client initialization;
- `AudioLessonCallResponse` for lesson-room lookup.

The call type is the literal `'audio_room'`, preventing callers from silently switching this screen to a video/default call type.

### 5.9 Learning data and imagery

#### `constants/images.ts`

All screen imagery remains centralized. The audio lesson uses:

- `mascotAuth` as the teacher visual;
- `audioLessonRoom` as the scene;
- `audioLessonLearner` only as a fallback when Clerk has no profile image.

The scene and fallback learner are remote URI objects, so the component still consumes the shared `images` registry rather than importing URLs directly.

#### `data/lessons.ts`

The screen resolves lesson content using `getLessonById`. The file contains the hardcoded typed phrases, translations, goal, teacher opening line, format, duration, XP, and language association used by the lesson screen and server validation.

Some titles were localized during the audio UI work. Those changes affect presentation, not Stream call behavior.

#### `data/units.ts`

Unit titles were localized to match the lesson-language presentation. This file has no Stream logic but is part of the visible audio lesson entry flow.

### 5.10 Native and build configuration

#### `app.json`

Key changes:

- `web.output` changed from `static` to `server` because Expo API routes require a server output.
- `@stream-io/video-react-native-sdk` config plugin enables Stream native setup.
- `@config-plugins/react-native-webrtc` configures native WebRTC permissions and linking.
- The microphone permission explains the live audio use.
- A conditional/future-facing camera permission remains because the WebRTC package supports video, while this call path never enables camera capture.
- `expo-build-properties` sets Android min SDK 24, required by Stream WebRTC.
- New Architecture remains enabled.

Native plugin changes require a development build and a regenerated native project. Expo Go cannot load this WebRTC integration.

Known compatibility check: the installed `@config-plugins/react-native-webrtc@15.0.1` package declares `expo: ^56` as its peer dependency, while this project currently uses Expo 54. TypeScript and Metro exports can still pass because they do not prove native config-plugin compatibility. Before the next clean native prebuild, either pin a plugin release that supports Expo 54 or upgrade Expo through the normal Expo upgrade process. Do not change either major version casually because WebRTC, the Stream SDK, and generated native projects must remain aligned.

#### `babel.config.js`

The Expo preset is retained and `react-native-worklets/plugin` is last. Worklets/Reanimated transformations are order-sensitive; placing the plugin last avoids transformed-code and native runtime mismatches.

#### `bunfig.toml`

`linker = "hoisted"` keeps dependencies in a Metro- and native-autolinking-friendly node_modules layout. Nested/isolated package layouts can prevent Expo autolinking or Metro from resolving native peer dependencies consistently.

#### `package.json`

Runtime dependencies added for this feature:

- `@stream-io/video-react-native-sdk` — Stream React Native call API, providers, hooks, and device controllers.
- `@stream-io/react-native-webrtc` — native realtime media transport.
- `@stream-io/node-sdk` — server-side user upsert, token generation, and call creation.
- `@react-native-community/netinfo` — Stream connectivity peer.
- `react-native-svg` — Stream UI peer.
- `@config-plugins/react-native-webrtc` — Expo native WebRTC config.
- `expo-build-properties` — Android minimum SDK configuration.
- `@clerk/backend` — server verification of Clerk bearer tokens.
- `expo-crypto` — UUID generation for lesson attempts.
- `expo-dev-client` — native development build workflow.

`@clerk/shared` is pinned through `overrides` so `@clerk/expo` and `@clerk/backend` use a single compatible shared package. Duplicate Clerk shared runtimes can make hooks behave as though they are outside `ClerkProvider`.

`typecheck` was added as an explicit script.

`@stream-io/feeds-react-native-sdk` appears in the dependency diff but is not imported by this audio lesson feature. It should be treated as unrelated/optional and can be removed if no Feeds feature uses it.

#### `bun.lock`

The lockfile records exact direct and transitive versions. It must change with `package.json` and should be committed with it so native SDK, WebRTC, Clerk backend, and their peer graph are reproducible.

### 5.11 Agent tooling artifacts

#### `skills-lock.json`

Records the installed GetStream agent-skill versions and hashes used while implementing and reviewing the integration. It does not execute in the app.

#### `.agents/skills/stream-*`

These directories are development guidance for future coding agents: Stream routing, React Native blueprints, live-doc lookup rules, and product-specific constraints. They are not bundled into the mobile runtime.

Only `stream-react-native`, `stream`, and `stream-docs` are directly relevant to this feature; the React web, Android-native, and generic builder skill directories support other project lanes.

## 6. Important design decisions

### Route-local Stream provider

Chosen because only the lesson route needs realtime audio. Benefits:

- no Stream connection during normal app browsing;
- native failures do not block the entire authenticated app;
- sign-out/provider ordering stays simple;
- the socket and microphone lifetime match the route lifetime.

A root provider would make sense later if calls must survive navigation or if incoming/ringing calls are added globally.

### Server-created calls

The mobile client could technically create calls with its user token, but the server route is preferred because lesson validation, call metadata, ownership, roles, and policy remain trusted and teachable.

### Local hardcoded lesson source

Both the screen and server import the same typed lesson data. This matches the no-database milestone while still preventing arbitrary client-provided lesson metadata.

### Audio-room call type

`audio_room` provides audio-oriented permissions and defaults. The feature disables backstage per call because a guided one-on-one lesson should connect immediately instead of requiring `goLive()`.

### Leave instead of globally ending

A learner owns their participation, not necessarily the room's global lifecycle. `leave()` is therefore the safe control. A future server cleanup job may end abandoned calls if needed.

### Explicit web fallback

Native WebRTC cannot run in Expo's web/server renderer. A clear unsupported-state screen is safer than bundling native code into web or pretending the call is active.

## 7. Failures encountered and what they taught us

### `Unable to resolve @stream-io/video-react-native-sdk`

Cause: the native SDK dependency was referenced before it was installed/resolved. Fix: install the package and compatible native peers, then rebuild the native app.

### `WebRTC native module not found`

Cause: native Stream code was evaluated in a runtime without the linked WebRTC module, especially web/server rendering or Expo Go. Fix: platform facades plus a real development build.

### `useClerk can only be used within ClerkProvider`

Cause: provider ordering/module duplication during integration. Fix: keep Clerk at the root, mount Stream beneath it, and pin a single `@clerk/shared` version.

### Repeating Preparing/connecting state and repeated requests

Cause: Clerk callback/object identity was included directly in effects. Each request updated state, produced a render, changed an identity, and restarted the effect. Fix: store the current callback in a ref and depend on stable primitive values.

### Stream `api_key not valid` / HTTP 401

Cause: Stream rejected the configured API key. Fix: verify that API key and secret come from the same Stream app, use canonical environment names, trim values, and restart Expo after changing `.env`.

### Stream target resolution HTTP 400

Cause: an unnecessary partial video override on an audio room produced an implicit `0x0` target resolution. Fix: remove the entire video override and rely on the audio-room defaults plus top-level `video: false`.

### Route warning for `audio-lesson`

Cause: a hidden route was declared under tabs after the file moved. Fix: remove it from tab layout and register the root stack route.

## 8. Running and verifying the feature

### After dependency or plugin changes

```bash
npx expo prebuild --clean
npx expo run:android
# or
npx expo run:ios
```

Use a development build, not Expo Go.

### After environment-only changes

```bash
npx expo start --clear
```

A full native rebuild is not normally required for API key/secret changes, but the Metro/API server must restart so it reloads `.env`.

### Static checks

```bash
npm run typecheck
npm run lint
git diff --check
```

### Bundle checks used for this implementation

```bash
npx expo export --platform web --clear
npx expo export --platform android --clear
```

The web export verifies both Expo API route bundles and confirms native WebRTC is excluded from web. The Android export verifies the native entry bundle can resolve the Stream provider and screen.

### Manual smoke test

1. Sign in with Clerk.
2. Select a language.
3. Open Learn and tap a lesson.
4. Confirm states progress from Preparing to Joining to Joined.
5. Confirm the learner name/profile appears.
6. Toggle Mic and verify Joined/Muted changes.
7. Toggle subtitles and the local phrase control.
8. End the lesson and verify the state becomes Ended without ending other users globally.
9. Retry and confirm a new session is created once, without repeated API logs.
10. Navigate back and confirm microphone activity stops.

## 9. Debugging checklist

| Symptom | First checks |
|---|---|
| Clerk provider error | Confirm `ClerkProvider` wraps `RootNavigator`; run `npm ls @clerk/shared` and look for duplicates. |
| Token route 401 | Confirm the mobile request has a Bearer token and `CLERK_SECRET_KEY` matches the publishable-key instance. |
| Stream credential 401 | Confirm Stream key and secret are from the same app; restart Expo. |
| Call route 400 | Read the first Stream error message; inspect `settings_override` and lesson request validation. |
| WebRTC module missing | Use a dev build; confirm Stream/WebRTC config plugins; do not use Expo Go. |
| Infinite API requests | Inspect effect dependencies for unstable Clerk/Stream objects or callbacks. |
| Cannot join backstage | Keep backstage disabled for this flow or ensure the member has the host role and use `goLive()` for a true room. |
| Mic button does nothing | Confirm the call is `JOINED`, microphone permission is granted, and the button is not disabled. |
| Web export crashes | Confirm all native Stream imports are behind the platform selector. |
| Double-leave error | Guard cleanup and button handlers with `CallingState.LEFT`. |

## 10. Safe extension points

### Add real AI teacher audio

Keep the current call transport and replace the local Audio-button behavior with a server-controlled Stream Vision/AI agent session. Secrets and model credentials must remain server-side. The agent should join the same trusted call id created by `/api/stream/audio-call`.

### Add transcription

Enable and start Stream transcription server-side, then render transcript events in the existing subtitle bubble. Do not conflate local phrase data with live transcript state.

### Add lesson completion and XP

Write to the existing Zustand/AsyncStorage lesson store only after a clear completion event. Leaving a call is not automatically the same as completing a lesson.

### Keep calls alive across navigation

Move `StreamVideoProvider` above the root navigator only if call continuity or ringing requires it. At that point, disconnect explicitly on Clerk sign-out and keep native/web platform isolation.

### Add multiple participants

The current call metadata and participant observer already support more than one participant. Add participant UI from Stream state rather than creating additional call objects.

## 11. Maintenance rules

- Never expose `STREAM_API_SECRET` or `CLERK_SECRET_KEY` to client code.
- Never accept a client-supplied Stream user id.
- Keep API key and secret from the same Stream application.
- Use `getOrCreateInstance` for the Stream client.
- Use `{ reuseInstance: true }` for the call handle.
- Keep native Stream imports out of the web/server bundle.
- Keep effect dependencies stable; use primitive values and refs where SDK/auth callbacks may change identity.
- Guard `leave()` against `CallingState.LEFT`.
- Use `leave()` for learner hangup; reserve global call ending for an authorized server/host operation.
- Preserve the built-in audio-room video defaults; do not add a partial target-resolution override.
- Re-run typecheck, lint, web export, and a native bundle/build after Stream SDK upgrades.

## 12. Reference material

- Original implementation request: `prompts/13-stream-integration.md`
- Original UI request: `prompts/12-audio-lesson-ui.md`
- Stream React Native audio-room tutorial: <https://getstream.io/video/sdk/react-native/tutorial/audio-room/>
- Stream call types and audio-room defaults: <https://getstream.io/video/docs/react/guides/configuring-call-types/>
- Stream joining and creating calls: <https://getstream.io/video/docs/react-native/guides/joining-and-creating-calls/>
- Clerk Expo overview: <https://clerk.com/docs/reference/expo/overview>

## 13. Generated/changed file inventory

### Runtime feature files

- `app/audio-lesson.tsx`
- `app/api/stream/token+api.ts`
- `app/api/stream/audio-call+api.ts`
- `components/audio-lesson-screen.tsx`
- `components/audio-lesson-screen.native.tsx`
- `components/audio-lesson-screen.web.tsx`
- `components/stream-video-provider.tsx`
- `components/stream-video-provider.native.tsx`
- `components/stream-video-provider.web.tsx`
- `lib/stream-api.ts`
- `lib/server/clerk-auth.ts`
- `lib/server/stream.ts`
- `types/stream.ts`

### Integration changes to existing files

- `app/_layout.tsx`
- `app/(tabs)/_layout.tsx`
- removed `app/(tabs)/audio-lesson.tsx`
- `components/lessons-screen.tsx`
- `components/bottom-tab-bar.tsx`
- `constants/images.ts`
- `data/lessons.ts`
- `data/units.ts`
- `app.json`
- `package.json`
- `bun.lock`

### Supporting generated files

- `.env.example`
- `babel.config.js`
- `bunfig.toml`
- `skills-lock.json`
- `.agents/skills/stream-*`
- `commands/integration audio.md` (this guide)
