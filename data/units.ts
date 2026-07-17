import type { LanguageId, LearningUnit } from '@/types/learning';

export const units: LearningUnit[] = [
  {
    id: 'spanish-unit-3-cafe',
    languageId: 'spanish',
    order: 3,
    level: 'A1',
    title: 'En el café',
    description: 'Practice friendly conversations for everyday places and people.',
  },
  {
    id: 'french-unit-1-first-conversations',
    languageId: 'french',
    order: 1,
    level: 'A1',
    title: 'Premières conversations',
    description: 'Learn how to greet people and order something politely.',
  },
  {
    id: 'japanese-unit-1-first-conversations',
    languageId: 'japanese',
    order: 1,
    level: 'A1',
    title: 'はじめての会話',
    description: 'Use polite greetings and simple café phrases.',
  },
  {
    id: 'korean-unit-1-first-conversations',
    languageId: 'korean',
    order: 1,
    level: 'A1',
    title: '첫 대화',
    description: 'Practice friendly greetings and simple requests.',
  },
  {
    id: 'german-unit-1-first-conversations',
    languageId: 'german',
    order: 1,
    level: 'A1',
    title: 'Erste Gespräche',
    description: 'Introduce yourself and order at a café.',
  },
  {
    id: 'chinese-unit-1-first-conversations',
    languageId: 'chinese',
    order: 1,
    level: 'A1',
    title: '初次对话',
    description: 'Learn basic Mandarin greetings and useful requests.',
  },
];

export function getUnitsByLanguage(languageId: LanguageId) {
  return units
    .filter((unit) => unit.languageId === languageId)
    .sort((firstUnit, secondUnit) => firstUnit.order - secondUnit.order);
}

export function getUnitById(unitId: string) {
  return units.find((unit) => unit.id === unitId);
}
