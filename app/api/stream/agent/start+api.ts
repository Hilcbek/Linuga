import {
  ApiRouteError,
  apiErrorResponse,
  requireClerkUserId,
} from '@/lib/server/clerk-auth';
import {
  prepareCallForVisionAgent,
  startVisionAgentSession,
} from '@/lib/server/vision-agent';

interface StartAgentRequestBody {
  callId?: unknown;
}

export async function POST(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const body = (await request.json()) as StartAgentRequestBody;

    if (typeof body.callId !== 'string') {
      throw new ApiRouteError('The AI teacher request is invalid.', 400);
    }

    await prepareCallForVisionAgent(body.callId, userId);
    const session = await startVisionAgentSession(body.callId);

    return Response.json(session, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
