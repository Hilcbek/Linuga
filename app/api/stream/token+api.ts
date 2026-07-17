import { apiErrorResponse, requireClerkUserId } from '@/lib/server/clerk-auth';
import { getStreamServer } from '@/lib/server/stream';

const STREAM_TOKEN_VALIDITY_SECONDS = 60 * 60 * 4;

export async function GET(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const { apiKey, client } = getStreamServer();

    await client.upsertUsers([{ id: userId, role: 'user' }]);

    const token = client.generateUserToken({
      user_id: userId,
      validity_in_seconds: STREAM_TOKEN_VALIDITY_SECONDS,
    });

    return Response.json({ apiKey, token, userId });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
