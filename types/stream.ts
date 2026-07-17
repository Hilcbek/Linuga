export interface StreamSessionResponse {
  apiKey: string;
  token: string;
  userId: string;
}

export interface AudioLessonCallResponse {
  agentUserId: string;
  callId: string;
  callType: 'audio_room';
  lessonId: string;
  languageId: string;
}

export interface VisionAgentSessionResponse {
  agentUserId: string;
  callId: string;
  sessionId: string;
  sessionStartedAt: string;
}
