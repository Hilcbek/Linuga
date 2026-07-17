import type {
  AudioLessonCallResponse,
  StreamSessionResponse,
  VisionAgentSessionResponse,
} from '@/types/stream';

type GetClerkToken = () => Promise<string | null>;

interface ApiErrorResponse {
  error?: string;
}

async function getAuthorizationHeader(getToken: GetClerkToken) {
  const token = await getToken();

  if (!token) {
    throw new Error('Your sign-in session expired. Please sign in again.');
  }

  return `Bearer ${token}`;
}

async function readApiError(response: Response) {
  const body = (await response.json().catch(() => null)) as ApiErrorResponse | null;

  return body?.error ?? `Request failed with status ${response.status}.`;
}

export async function fetchStreamSession(getToken: GetClerkToken) {
  const response = await fetch('/api/stream/token', {
    headers: {
      Authorization: await getAuthorizationHeader(getToken),
    },
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as StreamSessionResponse;
}

interface CreateAudioLessonCallOptions {
  getToken: GetClerkToken;
  languageId: string;
  lessonId: string;
  requestId: string;
}

export async function createAudioLessonCall({
  getToken,
  languageId,
  lessonId,
  requestId,
}: CreateAudioLessonCallOptions) {
  const response = await fetch('/api/stream/audio-call', {
    method: 'POST',
    headers: {
      Authorization: await getAuthorizationHeader(getToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ languageId, lessonId, requestId }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as AudioLessonCallResponse;
}

interface VisionAgentSessionOptions {
  callId: string;
  getToken: GetClerkToken;
}

export async function startVisionAgentSession({
  callId,
  getToken,
}: VisionAgentSessionOptions) {
  const response = await fetch('/api/stream/agent/start', {
    method: 'POST',
    headers: {
      Authorization: await getAuthorizationHeader(getToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ callId }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as VisionAgentSessionResponse;
}

interface StopVisionAgentSessionOptions extends VisionAgentSessionOptions {
  sessionId: string;
}

export async function stopVisionAgentSession({
  callId,
  getToken,
  sessionId,
}: StopVisionAgentSessionOptions) {
  const response = await fetch('/api/stream/agent/stop', {
    method: 'POST',
    headers: {
      Authorization: await getAuthorizationHeader(getToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ callId, sessionId }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}
