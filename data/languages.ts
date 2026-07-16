import type { LanguageId, LearningLanguage } from '@/types/learning';

export const languages: LearningLanguage[] = [
  {
    id: 'spanish',
    code: 'es',
    locale: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    flagEmoji: 'https://flagcdn.com/w320/es.png',
    learnerCount: 28_400_000,
    description: 'Learn everyday Spanish for travel and conversation.',
  },
  {
    id: 'french',
    code: 'fr',
    locale: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    flagEmoji: 'https://flagcdn.com/w320/fr.png',
    learnerCount: 19_400_000,
    description: 'Build confidence speaking practical, everyday French.',
  },
  {
    id: 'japanese',
    code: 'ja',
    locale: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    flagEmoji: 'https://flagcdn.com/w320/jp.png',
    learnerCount: 12_700_000,
    description: 'Practice useful Japanese phrases and polite conversation.',
  },
  {
    id: 'korean',
    code: 'ko',
    locale: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    flagEmoji: 'https://flagcdn.com/w320/kr.png',
    learnerCount: 9_300_000,
    description: 'Start speaking Korean with friendly guided lessons.',
  },
  {
    id: 'german',
    code: 'de',
    locale: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    flagEmoji: 'https://flagcdn.com/w320/de.png',
    learnerCount: 8_100_000,
    description: 'Learn clear, useful German for daily situations.',
  },
  {
    id: 'chinese',
    code: 'zh',
    locale: 'zh-CN',
    name: 'Chinese',
    nativeName: '中文',
    flagEmoji: 'https://flagcdn.com/w320/cn.png',
    learnerCount: 7_400_000,
    description: 'Develop beginner Mandarin vocabulary and speaking skills.',
  },
];

export function getLanguageById(languageId: LanguageId) {
  return languages.find((language) => language.id === languageId);
}
