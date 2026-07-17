import {
  ApiRouteError,
  apiErrorResponse,
  requireClerkUserId,
} from '@/lib/server/clerk-auth';
import {
  requireOwnedAudioLessonCall,
  stopVisionAgentSession,
} from '@/lib/server/vision-agent';

interface StopAgentRequestBody {
  callId?: unknown;
  sessionId?: unknown;
}

export async function POST(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const body = (await request.json()) as StopAgentRequestBody;

    if (
      typeof body.callId !== 'string' ||
      typeof body.sessionId !== 'string' ||
      !body.sessionId
    ) {
      throw new ApiRouteError('The AI teacher cleanup request is invalid.', 400);
    }

    await requireOwnedAudioLessonCall(body.callId, userId);
    await stopVisionAgentSession(body.callId, body.sessionId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
