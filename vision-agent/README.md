# Lingua Vision Agent

This service is the voice-only AI teacher for Lingua. A fresh Vision Agents
`Agent` joins each existing Stream `audio_room` call, reads the selected language
and lesson from the call's server-authored custom data, and uses Gemini Live
for speech-to-speech teaching.

The teacher always conducts the lesson in English. Target-language words and
phrases are introduced and explained through English.

## Environment

The service loads the repository root `.env` file, so the mobile backend and
Python service reuse the same Stream app credentials. Add the following value to
that file without exposing it to Expo client code:

```dotenv
GOOGLE_API_KEY=your_google_ai_studio_api_key
```

These existing root values are also required:

```dotenv
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

Optional settings:

```dotenv
VISION_AGENT_URL=http://127.0.0.1:8000
VISION_AGENT_USER_ID=lingua-ai-teacher
GEMINI_LIVE_MODEL=gemini-3.1-flash-live-preview
GEMINI_LIVE_VOICE=Leda
```

`VISION_AGENT_URL` is read only by the Expo API routes. The mobile bundle never
receives this URL or any Stream/Google secret. `VISION_AGENT_USER_ID` is shared
by the Expo backend and Python service so the server can add that user to each
audio room with the `admin` call role before the agent joins.

## Install

With `uv`:

```bash
cd vision-agent
uv sync
```

Or with the standard Python tooling used for local verification:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install 'vision-agents[gemini,getstream]==0.6.7'
```

## Run

Start the HTTP service from this folder:

```bash
uv run agent.py serve --host 127.0.0.1 --port 8000
```

The equivalent virtual-environment command is:

```bash
.venv/bin/python agent.py serve --host 127.0.0.1 --port 8000
```

Start a teacher for a call that the Expo API already created:

```bash
curl -X POST http://127.0.0.1:8000/calls/lesson-example/sessions \
  -H 'Content-Type: application/json' \
  -d '{"call_type":"audio_room"}'
```

Useful service endpoints:

- `GET /health` checks process liveness.
- `GET /ready` confirms the agent launcher finished warming up.
- `POST /calls/{call_id}/sessions` starts one teacher for a call.
- `DELETE /calls/{call_id}/sessions/{session_id}` requests cleanup.

The server intentionally allows only one teacher per call, leaves after 60
seconds alone, and caps a lesson at one hour. It binds to localhost in the
example because the built-in session API has no application authentication yet;
add authentication before exposing it publicly.

The app starts and stops sessions through authenticated Expo API routes. Those
routes verify that the signed-in Clerk user owns the requested Stream call,
ensure the room is live, and proxy to this localhost service. Do not call the
Vision Agent session endpoints directly from the mobile app.

Because each lesson is one learner plus one teacher, the service uses a
pass-through audio filter instead of Vision Agents' default multi-speaker Silero
filter. Gemini Live still handles voice activity and turn detection, while
startup does not need to download an unrelated multi-speaker model.

## Verify

```bash
.venv/bin/python -m unittest discover -s tests -v
.venv/bin/python agent.py --help
```
