import { languages } from '@/data/languages';
import { getLessonById } from '@/data/lessons';
import {
  ApiRouteError,
  apiErrorResponse,
  requireClerkUserId,
} from '@/lib/server/clerk-auth';
import { getStreamServer } from '@/lib/server/stream';
import {
  AUDIO_LESSON_CALL_TYPE,
  getVisionAgentUserId,
} from '@/lib/server/vision-agent';

interface AudioCallRequestBody {
  languageId?: unknown;
  lessonId?: unknown;
  requestId?: unknown;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const body = (await request.json()) as AudioCallRequestBody;

    if (
      typeof body.lessonId !== 'string' ||
      typeof body.languageId !== 'string' ||
      typeof body.requestId !== 'string' ||
      !UUID_PATTERN.test(body.requestId)
    ) {
      throw new ApiRouteError('The audio lesson request is invalid.', 400);
    }

    const lesson = getLessonById(body.lessonId);
    const language = languages.find(
      (candidate) => candidate.id === body.languageId,
    );

    if (!lesson || !language || lesson.languageId !== language.id) {
      throw new ApiRouteError('The selected lesson or language was not found.', 404);
    }

    const { client } = getStreamServer();
    const callId = `lesson-${body.requestId}`;
    const agentUserId = getVisionAgentUserId();

    await client.upsertUsers([
      { id: userId, role: 'user' },
      {
        id: agentUserId,
        name: 'Lingua AI Teacher',
        role: 'admin',
      },
    ]);

    const call = client.video.call(AUDIO_LESSON_CALL_TYPE, callId);

    await call.getOrCreate({
      data: {
        created_by_id: userId,
        members: [
          { user_id: userId, role: 'host' },
          { user_id: agentUserId, role: 'admin' },
        ],
        custom: {
          language_id: language.id,
          language_code: language.code,
          language_locale: language.locale,
          language_name: language.name,
          language_native_name: language.nativeName,
          lesson_id: lesson.id,
          lesson_title: lesson.title,
          lesson_description: lesson.description,
          lesson_level: lesson.level,
          lesson_format: lesson.format,
          lesson_goal: {
            summary: lesson.goal.summary,
            outcomes: lesson.goal.outcomes,
          },
          lesson_vocabulary: lesson.vocabulary,
          lesson_phrases: lesson.phrases,
          teacher_opening_line: lesson.teacherOpeningLine,
          ai_teacher_prompt: lesson.aiTeacherPrompt,
          session_owner_id: userId,
        },
        settings_override: {
          audio: {
            default_device: 'speaker',
            mic_default_on: true,
            speaker_default_on: true,
          },
        },
      },
      video: false,
    });
    await call.goLive();

    return Response.json({
      agentUserId,
      callId,
      callType: AUDIO_LESSON_CALL_TYPE,
      languageId: language.id,
      lessonId: lesson.id,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
