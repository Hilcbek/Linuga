export type LanguageId =
  | 'spanish'
  | 'french'
  | 'japanese'
  | 'korean'
  | 'german'
  | 'chinese';

export type LanguageCode = 'es' | 'fr' | 'ja' | 'ko' | 'de' | 'zh';

export type ProficiencyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LessonFormat = 'ai-audio' | 'guided-practice' | 'review';

export type ActivityType =
  | 'listen'
  | 'repeat'
  | 'translate'
  | 'multiple-choice'
  | 'conversation';

export interface LearningLanguage {
  id: LanguageId;
  code: LanguageCode;
  locale: string;
  name: string;
  nativeName: string;
  flagEmoji: string;
  learnerCount: number;
  description: string;
}

export interface LearningUnit {
  id: string;
  languageId: LanguageId;
  order: number;
  level: ProficiencyLevel;
  title: string;
  description: string;
}

export interface LessonGoal {
  summary: string;
  outcomes: string[];
}

export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  pronunciation?: string;
  example?: string;
  exampleTranslation?: string;
}

export interface LessonPhrase {
  id: string;
  text: string;
  translation: string;
  pronunciation?: string;
  usageNote?: string;
}

export interface LessonActivity {
  id: string;
  type: ActivityType;
  instruction: string;
  prompt: string;
  expectedAnswer?: string;
  choices?: string[];
}

export interface Lesson {
  id: string;
  unitId: string;
  languageId: LanguageId;
  order: number;
  level: ProficiencyLevel;
  format: LessonFormat;
  title: string;
  description: string;
  durationMinutes: number;
  xpReward: number;
  goal: LessonGoal;
  vocabulary: VocabularyItem[];
  phrases: LessonPhrase[];
  activities: LessonActivity[];
  teacherOpeningLine: string;
  aiTeacherPrompt: string;
}
