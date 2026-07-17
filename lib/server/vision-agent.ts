import { getStreamServer } from '@/lib/server/stream';

export const AUDIO_LESSON_CALL_TYPE = 'audio_room' as const;

const DEFAULT_VISION_AGENT_URL = 'http://127.0.0.1:8000';
const DEFAULT_VISION_AGENT_USER_ID = 'lingua-ai-teacher';
const VISION_AGENT_REQUEST_TIMEOUT_MS = 10_000;
const AUDIO_LESSON_CALL_ID_PATTERN =
  /^lesson-[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface VisionAgentStartResponseBody {
  call_id?: unknown;
  session_id?: unknown;
  session_started_at?: unknown;
}

export interface VisionAgentSession {
  agentUserId: string;
  callId: string;
  sessionId: string;
  sessionStartedAt: string;
}

export class VisionAgentServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'VisionAgentServiceError';
  }
}

function getVisionAgentBaseUrl() {
  const configuredUrl =
    process.env.VISION_AGENT_URL?.trim() || DEFAULT_VISION_AGENT_URL;

  try {
    const url = new URL(configuredUrl);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Unsupported Vision Agent protocol.');
    }

    url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
    return url;
  } catch {
    throw new VisionAgentServiceError(
      'The Vision Agent server URL is invalid.',
      503,
    );
  }
}

export function getVisionAgentUserId() {
  const userId =
    process.env.VISION_AGENT_USER_ID?.trim() || DEFAULT_VISION_AGENT_USER_ID;

  if (!/^[a-z0-9_.-]+$/i.test(userId)) {
    throw new VisionAgentServiceError(
      'The Vision Agent user ID is invalid.',
      503,
    );
  }

  return userId;
}

async function fetchVisionAgent(
  path: string,
  init: RequestInit,
  acceptedStatuses: number[] = [],
) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    VISION_AGENT_REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(new URL(path, getVisionAgentBaseUrl()), {
      ...init,
      signal: controller.signal,
    });

    if (!response.ok && !acceptedStatuses.includes(response.status)) {
      console.error(
        `Vision Agent request failed with status ${response.status}.`,
      );

      if (response.status === 429) {
        throw new VisionAgentServiceError(
          'An AI teacher is already joining this lesson. Please wait a moment.',
          409,
        );
      }

      throw new VisionAgentServiceError(
        'The AI teacher service could not complete the request.',
        response.status >= 500 ? 503 : 502,
      );
    }

    return response;
  } catch (error) {
    if (error instanceof VisionAgentServiceError) {
      throw error;
    }

    const isTimeout =
      error instanceof Error && error.name === 'AbortError';

    throw new VisionAgentServiceError(
      isTimeout
        ? 'The AI teacher took too long to respond.'
        : 'The AI teacher server is unavailable. Start it and try again.',
      isTimeout ? 504 : 503,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function requireOwnedAudioLessonCall(
  callId: string,
  userId: string,
) {
  if (!AUDIO_LESSON_CALL_ID_PATTERN.test(callId)) {
    throw new VisionAgentServiceError('The audio lesson was not found.', 404);
  }

  const { client } = getStreamServer();
  const call = client.video.call(AUDIO_LESSON_CALL_TYPE, callId);
  const response = await call.get();

  if (response.call.custom.session_owner_id !== userId) {
    throw new VisionAgentServiceError('The audio lesson was not found.', 404);
  }

  return call;
}

export async function prepareCallForVisionAgent(
  callId: string,
  userId: string,
) {
  const call = await requireOwnedAudioLessonCall(callId, userId);
  const { client } = getStreamServer();
  const agentUserId = getVisionAgentUserId();

  await client.upsertUsers([
    {
      id: agentUserId,
      name: 'Lingua AI Teacher',
      role: 'admin',
    },
  ]);
  await call.updateCallMembers({
    update_members: [{ user_id: agentUserId, role: 'admin' }],
  });

  if (call.data?.backstage) {
    await call.goLive();
  }

  return { agentUserId, call };
}

export async function startVisionAgentSession(
  callId: string,
): Promise<VisionAgentSession> {
  const response = await fetchVisionAgent(
    `calls/${encodeURIComponent(callId)}/sessions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ call_type: AUDIO_LESSON_CALL_TYPE }),
    },
  );
  const body = (await response.json()) as VisionAgentStartResponseBody;

  if (
    body.call_id !== callId ||
    typeof body.session_id !== 'string' ||
    !body.session_id ||
    typeof body.session_started_at !== 'string'
  ) {
    throw new VisionAgentServiceError(
      'The AI teacher server returned an invalid session.',
      502,
    );
  }

  return {
    agentUserId: getVisionAgentUserId(),
    callId,
    sessionId: body.session_id,
    sessionStartedAt: body.session_started_at,
  };
}

export async function stopVisionAgentSession(
  callId: string,
  sessionId: string,
) {
  await fetchVisionAgent(
    `calls/${encodeURIComponent(callId)}/sessions/${encodeURIComponent(sessionId)}`,
    { method: 'DELETE' },
    [404],
  );
}
