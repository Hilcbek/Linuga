---
name: Agent
description: Use when building real-time voice and video AI agents, deploying conversational interfaces, integrating with LLMs and speech services, or adding computer vision to applications. Agents handle call lifecycle, audio/video routing, turn-taking, and deployment.
metadata:
    mintlify-proj: agent
    version: "1.0"
---

# Vision Agents Skill

## Product Summary

Vision Agents is an open-source Python framework for building real-time voice and video AI agents. Agents join sessions, connect to AI providers through swappable plugins (LLM, STT, TTS, vision models), and respond in real time. The framework handles call lifecycle, audio/video routing, turn-taking, and deployment. Key files: `agent.py` (agent definition), `pyproject.toml` (dependencies), `.env` (API keys). CLI: `uv run agent.py run` (console mode), `uv run agent.py serve` (HTTP server). Primary docs: https://visionagents.ai

## When to Use

Reach for this skill when:
- Building voice support bots, phone agents, or conversational AI
- Creating video coaches that analyze camera feeds in real time
- Adding multimodal assistants that see and hear
- Deploying agents to production (Docker, Kubernetes, HTTP server)
- Integrating with 35+ AI providers (OpenAI, Gemini, Deepgram, ElevenLabs, etc.)
- Implementing function calling, RAG, or tool integration via MCP
- Testing agent behavior without audio/video infrastructure
- Scaling agents horizontally across multiple servers

## Quick Reference

### Agent Modes

| Mode | Use Case | Setup |
|------|----------|-------|
| **Realtime** | Lowest latency, simplest | `llm=gemini.Realtime()` (no STT/TTS needed) |
| **Custom Pipeline** | Full control per component | `llm=gemini.LLM()`, `stt=deepgram.STT()`, `tts=elevenlabs.TTS()` |

### Core Components

| Component | Purpose | Examples |
|-----------|---------|----------|
| **Edge Transport** | WebRTC/WebSocket layer | `getstream.Edge()`, `local.Edge()`, `tencent.Edge()` |
| **LLM** | Language model | `gemini.LLM()`, `openai.LLM()`, `anthropic.LLM()` |
| **STT** | Speech-to-text | `deepgram.STT()`, `elevenlabs.STT()`, `cartesia.STT()` |
| **TTS** | Text-to-speech | `elevenlabs.TTS()`, `cartesia.TTS()`, `kokoro.TTS()` |
| **Processors** | Video/audio analysis | `ultralytics.YOLOPoseProcessor()`, `roboflow.RoboflowCloudDetectionProcessor()` |
| **Avatar** | Visual character | `anam.Avatar()`, `liveavatar.Avatar()` |

### Essential Commands

```bash
# Scaffold a new project
uvx vision-agents init my-agent && cd my-agent

# Run in console mode (opens browser demo)
uv run agent.py run

# Run as HTTP server (production)
uv run agent.py serve --host 0.0.0.0 --port 8080

# Add plugins
uv add "vision-agents[deepgram,elevenlabs,gemini]"

# Run tests
uv run pytest tests/ -m integration
```

### Agent Constructor Parameters

```python
Agent(
    edge=getstream.Edge(),                    # Transport layer
    agent_user=User(name="...", id="agent"),  # Agent identity
    instructions="...",                       # System prompt
    llm=gemini.Realtime(),                    # Language model
    stt=deepgram.STT(),                       # Optional: speech-to-text
    tts=elevenlabs.TTS(),                     # Optional: text-to-speech
    processors=[...],                         # Optional: video/audio processors
    avatar=anam.Avatar(),                     # Optional: visual character
    mcp_servers=[...],                        # Optional: external tools
)
```

### Key Methods

| Method | Purpose |
|--------|---------|
| `await agent.create_call(call_type, call_id)` | Create a call |
| `async with agent.join(call):` | Join call (context manager) |
| `await agent.simple_response(text)` | Send text to LLM, speak response |
| `await agent.say(text)` | Speak text directly (bypass LLM) |
| `await agent.finish()` | Wait for call to end |
| `await agent.close()` | Clean up resources |
| `@llm.register_function()` | Register tool for function calling |

## Decision Guidance

### Realtime vs Custom Pipeline

| Decision | Realtime | Custom Pipeline |
|----------|----------|-----------------|
| **Latency priority** | ✓ Lowest latency | Slightly higher |
| **Provider flexibility** | Limited (OpenAI, Gemini, Qwen, xAI, AWS Bedrock) | Full control (mix any STT/LLM/TTS) |
| **Function calling** | Not supported | ✓ Full support |
| **Setup complexity** | Simpler | More configuration |
| **Video support** | ✓ Native | Via VLM plugins |

### STT/TTS with Built-in Turn Detection

| Provider | Built-in Turn Detection | Notes |
|----------|------------------------|-------|
| Deepgram | ✓ Yes | `eager_turn_detection=True` reduces latency |
| ElevenLabs | ✓ Yes | ~150ms latency |
| Cartesia | ✓ Yes | Streaming PCM |
| Others | No | Use separate `turn_detection` plugin |

### Deployment Path

| Stage | Command | When |
|-------|---------|------|
| **Local dev** | `uv run agent.py run` | Testing, prototyping |
| **HTTP server** | `uv run agent.py serve` | Single container, session management |
| **Docker** | `docker buildx build --platform linux/amd64 -t agent .` | Cloud deployment |
| **Horizontal scale** | Add Redis `SessionRegistry` | Multiple replicas needed |
| **Kubernetes** | Helm chart + Prometheus | Full production setup |

## Workflow

### 1. Scaffold and Configure

```bash
uvx vision-agents init my-agent && cd my-agent
cp .env.example .env
# Fill in API keys: STREAM_API_KEY, STREAM_API_SECRET, GOOGLE_API_KEY, etc.
```

### 2. Choose Your Mode

**Realtime (simplest):**
```python
from vision_agents.core import Agent, User
from vision_agents.plugins import getstream, gemini

agent = Agent(
    edge=getstream.Edge(),
    agent_user=User(name="Assistant", id="agent"),
    instructions="You're helpful.",
    llm=gemini.Realtime(),
)
```

**Custom Pipeline (full control):**
```python
agent = Agent(
    edge=getstream.Edge(),
    agent_user=User(name="Assistant", id="agent"),
    instructions="You're helpful.",
    llm=gemini.LLM(),
    stt=deepgram.STT(eager_turn_detection=True),
    tts=elevenlabs.TTS(),
)
```

### 3. Add Tools (Optional)

```python
@agent.llm.register_function(description="Get weather")
async def get_weather(location: str) -> dict:
    return {"temp": "22C", "condition": "Sunny"}
```

### 4. Define Call Behavior

```python
async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs):
    call = await agent.create_call(call_type, call_id)
    async with agent.join(call):
        await agent.simple_response("Say hi and introduce yourself")
        await agent.finish()
```

### 5. Wire Up Runner

```python
from vision_agents.core import Runner, AgentLauncher

runner = Runner(AgentLauncher(create_agent=create_agent, join_call=join_call))

if __name__ == "__main__":
    runner.cli()
```

### 6. Test Locally

```bash
uv run agent.py run
# Opens browser demo at http://localhost:8000
```

### 7. Deploy

```bash
# HTTP server for production
uv run agent.py serve --host 0.0.0.0 --port 8080

# Or containerize
docker buildx build --platform linux/amd64 -t my-agent .
```

## Common Gotchas

- **Agent reuse**: Do not reuse an `Agent` instance. Create a new agent for each call. Calling `join()` twice raises `RuntimeError`.
- **Realtime mode disables STT/TTS**: When using `AudioLLM` (realtime models), STT, TTS, and turn detection are automatically disabled. Don't pass them.
- **Async functions only**: `@llm.register_function()` requires async functions. Synchronous functions raise `ValueError`.
- **Turn detection conflicts**: If STT has built-in turn detection (`stt.turn_detection=True`), don't pass a separate `turn_detection` plugin — it's ignored automatically.
- **Environment variables**: Vision Agents auto-loads from `.env`. Ensure keys match plugin expectations (e.g., `DEEPGRAM_API_KEY`, `ELEVENLABS_API_KEY`).
- **GPU Dockerfile**: Only use `Dockerfile.gpu` if running local models (Roboflow, local VLMs). Most voice agents use cloud APIs and don't need GPUs.
- **Session limits**: In HTTP server mode, set `max_concurrent_sessions`, `max_sessions_per_call`, and `agent_idle_timeout` to prevent resource exhaustion.
- **Video override path**: Set `agent.set_video_track_override_path()` before calling `join()`, not after.
- **MCP server timeouts**: Remote MCP servers need explicit `timeout` and `session_timeout` parameters to avoid hanging.
- **Realtime models don't support function calling**: Use custom pipeline mode if you need tools.

## Verification Checklist

Before submitting work:

- [ ] Agent creates and joins a call without errors
- [ ] Audio flows correctly (user speaks → agent responds)
- [ ] Tools/functions are called with correct arguments (if applicable)
- [ ] Environment variables are set (check `.env`)
- [ ] Plugins are installed (`uv add vision-agents[...]`)
- [ ] Tests pass: `uv run pytest tests/ -m integration`
- [ ] Docker image builds: `docker buildx build --platform linux/amd64 -t agent .`
- [ ] HTTP server starts: `uv run agent.py serve --host 0.0.0.0 --port 8080`
- [ ] Metrics are emitted (check logs for latency, token counts)
- [ ] No agent instances are reused across calls

## Resources

- **Comprehensive navigation**: https://visionagents.ai/llms.txt
- **Quickstart guide**: https://visionagents.ai/introduction/quickstart
- **Voice agents (custom pipelines)**: https://visionagents.ai/introduction/voice-agents
- **Video agents (VLMs, processors)**: https://visionagents.ai/introduction/video-agents
- **Integrations (35+ providers)**: https://visionagents.ai/integrations/introduction-to-integrations
- **HTTP server & scaling**: https://visionagents.ai/guides/http-server
- **Deployment (Docker, Kubernetes)**: https://visionagents.ai/guides/deploying-overview
- **Function calling & MCP**: https://visionagents.ai/guides/mcp-tool-calling
- **Testing agents**: https://visionagents.ai/guides/testing
- **GitHub repository**: https://github.com/GetStream/vision-agents

---

> For additional documentation and navigation, see: https://visionagents.ai/llms.txt