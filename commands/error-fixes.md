# Gradle / Expo Android Build Troubleshooting Cheat Sheet

Quick reference for "process 'X' finished with non-zero exit value" and similar opaque Gradle failures.

## Command → What it does

| Command | What it does |
|---|---|
| `./gradlew --stop` | Kills all running Gradle daemons. Fixes stale-environment issues (wrong `PATH`, old `node` version cached in daemon memory). **Try this first.** |
| `npx expo run:android --device` | Rebuilds and runs on a connected/selected device using the real npm/node toolchain (safer than `bunx` for native builds). |
| `./gradlew app:assembleDebug -x lint -x test --stacktrace` | Runs the debug build, skips lint/tests, prints the full Java/Kotlin stacktrace on failure instead of the generic one-liner. |
| `./gradlew app:assembleDebug -x lint -x test --debug > /tmp/gradle-debug.log 2>&1` | Same as above but with full debug-level logging piped to a file — use when `--stacktrace` alone isn't enough. |
| `node ../node_modules/expo-modules-autolinking/bin/expo-modules-autolinking.js resolve -p android --json` | Runs Expo's autolinking resolution script directly (the same one Gradle calls internally). If this works standalone but fails under Gradle, it confirms an environment/daemon issue, not a code bug. |
| `env -i bash -lc 'which node'` | Simulates a clean, non-interactive shell to check what `node` resolves to *without* your normal `.bashrc`/`.zshrc`/`nvm` setup. Compares against what Gradle's daemon actually sees. |
| `which node` / `node -v` | Confirms `node` is on PATH and which version, from your normal interactive shell. |
| `npx expo-doctor` | Checks for Expo SDK / native module / autolinking version mismatches across your dependencies. |
| `npx expo prebuild --clean` | Regenerates native `android/` and `ios/` folders from scratch based on current `app.json`/config plugins. Use after changing `scheme`, `plugins`, or any native-config-affecting setting. |
| `rm -rf node_modules bun.lock && bun install` | Full clean reinstall of dependencies. Use if you suspect a corrupted `node_modules` state. |
| `rm -rf android/.gradle ~/.gradle/caches` | Nukes Gradle's local + global caches. Use if daemon restart + clean install don't fix it — rules out cache corruption. |

## Diagnosis order (cheapest → most invasive)

1. `./gradlew --stop` → rebuild
2. `--stacktrace` (or `--debug`) to find the *real* error, not Gradle's wrapper message
3. Run the failing subprocess command directly in your shell to isolate: environment issue vs. actual code/config bug
4. `env -i bash -lc 'which node'` to check environment parity
5. `npx expo-doctor` for version mismatches
6. `npx expo prebuild --clean` if native config changed
7. Full `node_modules` reinstall + Gradle cache wipe (nuclear option)

## Key mental model

Gradle daemons are long-lived background processes that **freeze the environment (PATH, etc.) they had at launch time**. If you switch Node versions, change shell config, or the daemon was started by a different tool (Android Studio vs. terminal), it can end up calling the wrong `node` — even though your own shell resolves it fine. `./gradlew --stop` forces a fresh daemon on the next build, which re-inherits your current environment correctly.