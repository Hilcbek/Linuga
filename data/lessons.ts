import type { LanguageId, Lesson } from '@/types/learning';

interface TeacherPromptOptions {
  language: string;
  goal: string;
  focus: string;
}

function createTeacherPrompt({ language, goal, focus }: TeacherPromptOptions) {
  return [
    `You are Lingua, a warm and encouraging AI ${language} teacher leading a beginner voice lesson.`,
    'Speak English for explanations and use the target language only for examples and practice.',
    `The lesson goal is: ${goal}`,
    `Focus on: ${focus}.`,
    'Ask one short question at a time, invite the learner to repeat key phrases aloud, and wait for their answer.',
    'Correct mistakes gently, briefly explain the correction in English, and celebrate progress.',
    'Stay at an A1 level and do not introduce grammar or vocabulary outside the lesson unless the learner asks.',
  ].join(' ');
}

type SupplementalLanguageId = Exclude<LanguageId, 'spanish'>;

interface SupplementalLessonContent {
  description: string;
  expectedAnswer: string;
  goal: string;
  phrase: Lesson['phrases'][number];
  prompt: string;
  slug: string;
  title: string;
  vocabulary: Lesson['vocabulary'];
}

interface SupplementalLanguageLessons {
  languageId: SupplementalLanguageId;
  languageName: string;
  lessons: SupplementalLessonContent[];
  unitId: string;
}

const supplementalLanguageLessons: SupplementalLanguageLessons[] = [
  {
    languageId: 'french',
    languageName: 'French',
    unitId: 'french-unit-1-first-conversations',
    lessons: [
      {
        slug: 'daily-life',
        title: 'La vie quotidienne',
        description: 'Talk about one simple part of your daily routine.',
        goal: 'Describe a simple morning routine in French.',
        vocabulary: [
          {
            id: 'french-daily-morning',
            term: 'le matin',
            translation: 'the morning',
            pronunciation: 'luh mah-TAN',
          },
          {
            id: 'french-daily-work',
            term: 'travailler',
            translation: 'to work',
            pronunciation: 'trah-vah-YAY',
          },
        ],
        phrase: {
          id: 'french-daily-phrase',
          text: 'Je travaille le matin.',
          translation: 'I work in the morning.',
          pronunciation: 'zhuh trah-VAI luh mah-TAN',
        },
        prompt: 'Que faites-vous le matin ?',
        expectedAnswer: 'Je travaille le matin.',
      },
      {
        slug: 'travel-directions',
        title: 'Voyages et directions',
        description: 'Ask where a place is and follow a simple direction.',
        goal: 'Ask for and understand a basic direction in French.',
        vocabulary: [
          {
            id: 'french-directions-left',
            term: 'à gauche',
            translation: 'to the left',
            pronunciation: 'ah GOHSH',
          },
          {
            id: 'french-directions-right',
            term: 'à droite',
            translation: 'to the right',
            pronunciation: 'ah DRWAHT',
          },
        ],
        phrase: {
          id: 'french-directions-phrase',
          text: 'Où est la gare ?',
          translation: 'Where is the train station?',
          pronunciation: 'oo eh lah GAHR',
        },
        prompt: 'Vous cherchez la gare. Que dites-vous ?',
        expectedAnswer: 'Où est la gare ?',
      },
      {
        slug: 'shopping',
        title: 'Les achats',
        description: 'Ask the price of an item in a shop.',
        goal: 'Ask how much something costs in French.',
        vocabulary: [
          {
            id: 'french-shopping-price',
            term: 'le prix',
            translation: 'the price',
            pronunciation: 'luh PREE',
          },
          {
            id: 'french-shopping-shirt',
            term: 'la chemise',
            translation: 'the shirt',
            pronunciation: 'lah shuh-MEEZ',
          },
        ],
        phrase: {
          id: 'french-shopping-phrase',
          text: 'Combien ça coûte ?',
          translation: 'How much does it cost?',
          pronunciation: 'kohm-BYAN sah KOOT',
        },
        prompt: 'Vous voulez connaître le prix. Que dites-vous ?',
        expectedAnswer: 'Combien ça coûte ?',
      },
      {
        slug: 'family-friends',
        title: 'Famille et amis',
        description: 'Introduce a friend or family member.',
        goal: 'Introduce someone important to you in French.',
        vocabulary: [
          {
            id: 'french-family-family',
            term: 'la famille',
            translation: 'the family',
            pronunciation: 'lah fah-MEE',
          },
          {
            id: 'french-family-friend',
            term: 'un ami',
            translation: 'a friend',
            pronunciation: 'uhn ah-MEE',
          },
        ],
        phrase: {
          id: 'french-family-phrase',
          text: 'Voici mon ami.',
          translation: 'This is my friend.',
          pronunciation: 'vwah-SEE mohn ah-MEE',
        },
        prompt: 'Présentez votre ami.',
        expectedAnswer: 'Voici mon ami.',
      },
    ],
  },
  {
    languageId: 'japanese',
    languageName: 'Japanese',
    unitId: 'japanese-unit-1-first-conversations',
    lessons: [
      {
        slug: 'daily-life',
        title: '日常生活',
        description: 'Talk about a simple part of your morning.',
        goal: 'Describe one morning activity in Japanese.',
        vocabulary: [
          {
            id: 'japanese-daily-morning',
            term: 'あさ',
            translation: 'morning',
            pronunciation: 'ah-sah',
          },
          {
            id: 'japanese-daily-study',
            term: 'べんきょうする',
            translation: 'to study',
            pronunciation: 'ben-kyoh soo-roo',
          },
        ],
        phrase: {
          id: 'japanese-daily-phrase',
          text: 'あさにべんきょうします。',
          translation: 'I study in the morning.',
          pronunciation: 'ah-sah nee ben-kyoh shee-mahss',
        },
        prompt: 'あさになにをしますか。',
        expectedAnswer: 'あさにべんきょうします。',
      },
      {
        slug: 'travel-directions',
        title: '旅行と道案内',
        description: 'Ask where the station is and understand directions.',
        goal: 'Ask for a basic direction in Japanese.',
        vocabulary: [
          {
            id: 'japanese-directions-left',
            term: 'ひだり',
            translation: 'left',
            pronunciation: 'hee-dah-ree',
          },
          {
            id: 'japanese-directions-right',
            term: 'みぎ',
            translation: 'right',
            pronunciation: 'mee-gee',
          },
        ],
        phrase: {
          id: 'japanese-directions-phrase',
          text: 'えきはどこですか。',
          translation: 'Where is the station?',
          pronunciation: 'eh-kee wah doh-koh dess-kah',
        },
        prompt: 'えきをさがしています。なんといいますか。',
        expectedAnswer: 'えきはどこですか。',
      },
      {
        slug: 'shopping',
        title: '買い物',
        description: 'Ask the price of something you want.',
        goal: 'Ask how much an item costs in Japanese.',
        vocabulary: [
          {
            id: 'japanese-shopping-price',
            term: 'いくら',
            translation: 'how much',
            pronunciation: 'ee-koo-rah',
          },
          {
            id: 'japanese-shopping-shirt',
            term: 'シャツ',
            translation: 'shirt',
            pronunciation: 'shah-tsoo',
          },
        ],
        phrase: {
          id: 'japanese-shopping-phrase',
          text: 'これはいくらですか。',
          translation: 'How much is this?',
          pronunciation: 'koh-reh wah ee-koo-rah dess-kah',
        },
        prompt: 'ねだんをきいてください。',
        expectedAnswer: 'これはいくらですか。',
      },
      {
        slug: 'family-friends',
        title: '家族と友達',
        description: 'Introduce a friend to someone.',
        goal: 'Introduce a friend in Japanese.',
        vocabulary: [
          {
            id: 'japanese-family-family',
            term: 'かぞく',
            translation: 'family',
            pronunciation: 'kah-zoh-koo',
          },
          {
            id: 'japanese-family-friend',
            term: 'ともだち',
            translation: 'friend',
            pronunciation: 'toh-moh-dah-chee',
          },
        ],
        phrase: {
          id: 'japanese-family-phrase',
          text: 'こちらはわたしのともだちです。',
          translation: 'This is my friend.',
          pronunciation: 'koh-chee-rah wah wah-tah-shee noh toh-moh-dah-chee dess',
        },
        prompt: 'ともだちをしょうかいしてください。',
        expectedAnswer: 'こちらはわたしのともだちです。',
      },
    ],
  },
  {
    languageId: 'korean',
    languageName: 'Korean',
    unitId: 'korean-unit-1-first-conversations',
    lessons: [
      {
        slug: 'daily-life',
        title: '일상생활',
        description: 'Talk about one part of your daily routine.',
        goal: 'Describe a morning activity in Korean.',
        vocabulary: [
          {
            id: 'korean-daily-morning',
            term: '아침',
            translation: 'morning',
            pronunciation: 'ah-chim',
          },
          {
            id: 'korean-daily-study',
            term: '공부하다',
            translation: 'to study',
            pronunciation: 'gohng-boo-hah-dah',
          },
        ],
        phrase: {
          id: 'korean-daily-phrase',
          text: '아침에 공부해요.',
          translation: 'I study in the morning.',
          pronunciation: 'ah-chee-meh gohng-boo-heh-yoh',
        },
        prompt: '아침에 뭐 해요?',
        expectedAnswer: '아침에 공부해요.',
      },
      {
        slug: 'travel-directions',
        title: '여행과 길 찾기',
        description: 'Ask where the station is and follow directions.',
        goal: 'Ask for a basic direction in Korean.',
        vocabulary: [
          {
            id: 'korean-directions-left',
            term: '왼쪽',
            translation: 'left',
            pronunciation: 'wen-jjok',
          },
          {
            id: 'korean-directions-right',
            term: '오른쪽',
            translation: 'right',
            pronunciation: 'oh-roon-jjok',
          },
        ],
        phrase: {
          id: 'korean-directions-phrase',
          text: '역이 어디예요?',
          translation: 'Where is the station?',
          pronunciation: 'yuh-gee uh-dee-yeh-yoh',
        },
        prompt: '역을 찾고 있어요. 뭐라고 말해요?',
        expectedAnswer: '역이 어디예요?',
      },
      {
        slug: 'shopping',
        title: '쇼핑',
        description: 'Ask the price of an item.',
        goal: 'Ask how much something costs in Korean.',
        vocabulary: [
          {
            id: 'korean-shopping-price',
            term: '얼마',
            translation: 'how much',
            pronunciation: 'uhl-mah',
          },
          {
            id: 'korean-shopping-shirt',
            term: '셔츠',
            translation: 'shirt',
            pronunciation: 'shuh-chuh',
          },
        ],
        phrase: {
          id: 'korean-shopping-phrase',
          text: '이거 얼마예요?',
          translation: 'How much is this?',
          pronunciation: 'ee-guh uhl-mah-yeh-yoh',
        },
        prompt: '가격을 물어보세요.',
        expectedAnswer: '이거 얼마예요?',
      },
      {
        slug: 'family-friends',
        title: '가족과 친구',
        description: 'Introduce a friend or family member.',
        goal: 'Introduce a friend in Korean.',
        vocabulary: [
          {
            id: 'korean-family-family',
            term: '가족',
            translation: 'family',
            pronunciation: 'gah-jok',
          },
          {
            id: 'korean-family-friend',
            term: '친구',
            translation: 'friend',
            pronunciation: 'chin-goo',
          },
        ],
        phrase: {
          id: 'korean-family-phrase',
          text: '이 사람은 제 친구예요.',
          translation: 'This person is my friend.',
          pronunciation: 'ee sah-rah-moon jeh chin-goo-yeh-yoh',
        },
        prompt: '친구를 소개해 주세요.',
        expectedAnswer: '이 사람은 제 친구예요.',
      },
    ],
  },
  {
    languageId: 'german',
    languageName: 'German',
    unitId: 'german-unit-1-first-conversations',
    lessons: [
      {
        slug: 'daily-life',
        title: 'Alltag',
        description: 'Talk about one simple part of your daily routine.',
        goal: 'Describe a morning activity in German.',
        vocabulary: [
          {
            id: 'german-daily-morning',
            term: 'der Morgen',
            translation: 'the morning',
            pronunciation: 'dehr MOR-gen',
          },
          {
            id: 'german-daily-work',
            term: 'arbeiten',
            translation: 'to work',
            pronunciation: 'AR-bye-ten',
          },
        ],
        phrase: {
          id: 'german-daily-phrase',
          text: 'Ich arbeite am Morgen.',
          translation: 'I work in the morning.',
          pronunciation: 'ikh AR-bye-tuh ahm MOR-gen',
        },
        prompt: 'Was machst du am Morgen?',
        expectedAnswer: 'Ich arbeite am Morgen.',
      },
      {
        slug: 'travel-directions',
        title: 'Reisen und Wegbeschreibungen',
        description: 'Ask where the station is and follow a direction.',
        goal: 'Ask for a basic direction in German.',
        vocabulary: [
          {
            id: 'german-directions-left',
            term: 'links',
            translation: 'left',
            pronunciation: 'links',
          },
          {
            id: 'german-directions-right',
            term: 'rechts',
            translation: 'right',
            pronunciation: 'rekhts',
          },
        ],
        phrase: {
          id: 'german-directions-phrase',
          text: 'Wo ist der Bahnhof?',
          translation: 'Where is the train station?',
          pronunciation: 'voh ist dehr BAHN-hohf',
        },
        prompt: 'Du suchst den Bahnhof. Was sagst du?',
        expectedAnswer: 'Wo ist der Bahnhof?',
      },
      {
        slug: 'shopping',
        title: 'Einkaufen',
        description: 'Ask the price of something in a shop.',
        goal: 'Ask how much an item costs in German.',
        vocabulary: [
          {
            id: 'german-shopping-price',
            term: 'der Preis',
            translation: 'the price',
            pronunciation: 'dehr PRYCE',
          },
          {
            id: 'german-shopping-shirt',
            term: 'das Hemd',
            translation: 'the shirt',
            pronunciation: 'dahs hehmt',
          },
        ],
        phrase: {
          id: 'german-shopping-phrase',
          text: 'Wie viel kostet das?',
          translation: 'How much does that cost?',
          pronunciation: 'vee feel KOS-tet dahs',
        },
        prompt: 'Du möchtest den Preis wissen. Was sagst du?',
        expectedAnswer: 'Wie viel kostet das?',
      },
      {
        slug: 'family-friends',
        title: 'Familie und Freunde',
        description: 'Introduce a friend or family member.',
        goal: 'Introduce a friend in German.',
        vocabulary: [
          {
            id: 'german-family-family',
            term: 'die Familie',
            translation: 'the family',
            pronunciation: 'dee fah-MEE-lee-uh',
          },
          {
            id: 'german-family-friend',
            term: 'der Freund',
            translation: 'the friend',
            pronunciation: 'dehr froynt',
          },
        ],
        phrase: {
          id: 'german-family-phrase',
          text: 'Das ist mein Freund.',
          translation: 'This is my friend.',
          pronunciation: 'dahs ist mine froynt',
        },
        prompt: 'Stell deinen Freund vor.',
        expectedAnswer: 'Das ist mein Freund.',
      },
    ],
  },
  {
    languageId: 'chinese',
    languageName: 'Mandarin Chinese',
    unitId: 'chinese-unit-1-first-conversations',
    lessons: [
      {
        slug: 'daily-life',
        title: '日常生活',
        description: 'Talk about one part of your morning routine.',
        goal: 'Describe a morning activity in Mandarin Chinese.',
        vocabulary: [
          {
            id: 'chinese-daily-morning',
            term: '早上',
            translation: 'morning',
            pronunciation: 'zǎoshang',
          },
          {
            id: 'chinese-daily-study',
            term: '学习',
            translation: 'to study',
            pronunciation: 'xuéxí',
          },
        ],
        phrase: {
          id: 'chinese-daily-phrase',
          text: '我早上学习。',
          translation: 'I study in the morning.',
          pronunciation: 'wǒ zǎoshang xuéxí',
        },
        prompt: '你早上做什么？',
        expectedAnswer: '我早上学习。',
      },
      {
        slug: 'travel-directions',
        title: '旅行与问路',
        description: 'Ask where the station is and follow directions.',
        goal: 'Ask for a basic direction in Mandarin Chinese.',
        vocabulary: [
          {
            id: 'chinese-directions-left',
            term: '左边',
            translation: 'left side',
            pronunciation: 'zuǒbian',
          },
          {
            id: 'chinese-directions-right',
            term: '右边',
            translation: 'right side',
            pronunciation: 'yòubian',
          },
        ],
        phrase: {
          id: 'chinese-directions-phrase',
          text: '车站在哪里？',
          translation: 'Where is the station?',
          pronunciation: 'chēzhàn zài nǎlǐ',
        },
        prompt: '你在找车站。你怎么问？',
        expectedAnswer: '车站在哪里？',
      },
      {
        slug: 'shopping',
        title: '购物',
        description: 'Ask how much an item costs.',
        goal: 'Ask the price of an item in Mandarin Chinese.',
        vocabulary: [
          {
            id: 'chinese-shopping-price',
            term: '多少钱',
            translation: 'how much money',
            pronunciation: 'duōshao qián',
          },
          {
            id: 'chinese-shopping-shirt',
            term: '衬衫',
            translation: 'shirt',
            pronunciation: 'chènshān',
          },
        ],
        phrase: {
          id: 'chinese-shopping-phrase',
          text: '这个多少钱？',
          translation: 'How much is this?',
          pronunciation: 'zhège duōshao qián',
        },
        prompt: '你想知道价格。你怎么问？',
        expectedAnswer: '这个多少钱？',
      },
      {
        slug: 'family-friends',
        title: '家人与朋友',
        description: 'Introduce a friend or family member.',
        goal: 'Introduce a friend in Mandarin Chinese.',
        vocabulary: [
          {
            id: 'chinese-family-family',
            term: '家人',
            translation: 'family member',
            pronunciation: 'jiārén',
          },
          {
            id: 'chinese-family-friend',
            term: '朋友',
            translation: 'friend',
            pronunciation: 'péngyou',
          },
        ],
        phrase: {
          id: 'chinese-family-phrase',
          text: '这是我的朋友。',
          translation: 'This is my friend.',
          pronunciation: 'zhè shì wǒ de péngyou',
        },
        prompt: '请介绍你的朋友。',
        expectedAnswer: '这是我的朋友。',
      },
    ],
  },
];

const supplementalLessons = supplementalLanguageLessons.flatMap(
  ({ languageId, languageName, lessons: lessonContent, unitId }) =>
    lessonContent.map((content, index): Lesson => {
      const lessonId = `${languageId}-${content.slug}`;

      return {
        id: lessonId,
        unitId,
        languageId,
        order: index + 3,
        level: 'A1',
        format:
          index === lessonContent.length - 1
            ? 'review'
            : index === 0
              ? 'ai-audio'
              : 'guided-practice',
        title: content.title,
        description: content.description,
        durationMinutes: 9 + (index % 2),
        xpReward: index === lessonContent.length - 1 ? 20 : 15,
        goal: {
          summary: content.goal,
          outcomes: [
            `Recognize useful ${languageName} vocabulary for this topic.`,
            'Say one complete beginner phrase with confidence.',
          ],
        },
        vocabulary: content.vocabulary,
        phrases: [content.phrase],
        activities: [
          {
            id: `${lessonId}-repeat`,
            type: 'repeat',
            instruction: 'Repeat the key phrase aloud.',
            prompt: content.phrase.text,
            expectedAnswer: content.phrase.text,
          },
          {
            id: `${lessonId}-conversation`,
            type: 'conversation',
            instruction: 'Answer the teacher using the lesson phrase.',
            prompt: content.prompt,
            expectedAnswer: content.expectedAnswer,
          },
        ],
        teacherOpeningLine: `Let’s practice ${content.title.toLocaleLowerCase()} with one useful ${languageName} phrase.`,
        aiTeacherPrompt: createTeacherPrompt({
          language: languageName,
          goal: content.goal,
          focus: [
            ...content.vocabulary.map((item) => item.term),
            content.phrase.text,
          ].join(', '),
        }),
      };
    }),
);

export const lessons: Lesson[] = [
  {
    id: 'spanish-greetings',
    unitId: 'spanish-unit-3-cafe',
    languageId: 'spanish',
    order: 1,
    level: 'A1',
    format: 'ai-audio',
    title: 'Saludos y presentaciones',
    description: 'Say hello, share your name, and meet someone new.',
    durationMinutes: 8,
    xpReward: 10,
    goal: {
      summary: 'Introduce yourself and greet someone in Spanish.',
      outcomes: [
        'Use a greeting that matches the time of day.',
        'Say your name and ask for another person’s name.',
      ],
    },
    vocabulary: [
      {
        id: 'spanish-greetings-hola',
        term: 'hola',
        translation: 'hello',
        pronunciation: 'OH-lah',
        example: 'Hola, soy Ana.',
        exampleTranslation: 'Hello, I am Ana.',
      },
      {
        id: 'spanish-greetings-nombre',
        term: 'nombre',
        translation: 'name',
        pronunciation: 'NOHM-breh',
        example: 'Mi nombre es Alex.',
        exampleTranslation: 'My name is Alex.',
      },
      {
        id: 'spanish-greetings-encantado',
        term: 'encantado',
        translation: 'nice to meet you',
        pronunciation: 'en-kahn-TAH-doh',
      },
    ],
    phrases: [
      {
        id: 'spanish-greetings-my-name',
        text: 'Me llamo Alex.',
        translation: 'My name is Alex.',
        pronunciation: 'meh YAH-moh Alex',
      },
      {
        id: 'spanish-greetings-your-name',
        text: '¿Cómo te llamas?',
        translation: 'What is your name?',
        pronunciation: 'KOH-moh teh YAH-mahs',
      },
    ],
    activities: [
      {
        id: 'spanish-greetings-repeat',
        type: 'repeat',
        instruction: 'Repeat the greeting aloud.',
        prompt: 'Hola, me llamo Alex.',
        expectedAnswer: 'Hola, me llamo Alex.',
      },
      {
        id: 'spanish-greetings-conversation',
        type: 'conversation',
        instruction: 'Answer with your own name.',
        prompt: '¡Hola! ¿Cómo te llamas?',
        expectedAnswer: 'Me llamo…',
      },
    ],
    teacherOpeningLine:
      '¡Hola! Today we will learn how to greet someone and introduce ourselves in Spanish.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Spanish',
      goal: 'Introduce yourself and greet someone in Spanish.',
      focus: 'hola, me llamo, cómo te llamas, and encantado',
    }),
  },
  {
    id: 'spanish-daily-life',
    unitId: 'spanish-unit-3-cafe',
    languageId: 'spanish',
    order: 2,
    level: 'A1',
    format: 'ai-audio',
    title: 'La vida diaria',
    description: 'Talk about a few simple parts of your day.',
    durationMinutes: 9,
    xpReward: 10,
    goal: {
      summary: 'Describe a simple daily routine in Spanish.',
      outcomes: [
        'Say what you do in the morning.',
        'Ask someone how their day is going.',
      ],
    },
    vocabulary: [
      {
        id: 'spanish-daily-morning',
        term: 'la mañana',
        translation: 'the morning',
        pronunciation: 'lah mah-NYAH-nah',
      },
      {
        id: 'spanish-daily-work',
        term: 'trabajar',
        translation: 'to work',
        pronunciation: 'trah-bah-HAR',
      },
      {
        id: 'spanish-daily-study',
        term: 'estudiar',
        translation: 'to study',
        pronunciation: 'es-too-dee-AR',
      },
    ],
    phrases: [
      {
        id: 'spanish-daily-good-morning',
        text: 'Buenos días.',
        translation: 'Good morning.',
        pronunciation: 'BWEH-nohs DEE-ahs',
      },
      {
        id: 'spanish-daily-i-study',
        text: 'Estudio por la mañana.',
        translation: 'I study in the morning.',
        pronunciation: 'es-TOO-dee-oh por lah mah-NYAH-nah',
      },
    ],
    activities: [
      {
        id: 'spanish-daily-listen',
        type: 'listen',
        instruction: 'Listen for the time of day.',
        prompt: 'Trabajo por la mañana.',
        expectedAnswer: 'In the morning.',
      },
      {
        id: 'spanish-daily-translate',
        type: 'translate',
        instruction: 'Say this in Spanish.',
        prompt: 'I study in the morning.',
        expectedAnswer: 'Estudio por la mañana.',
      },
    ],
    teacherOpeningLine:
      'Buenos días! Let’s practice a few easy ways to talk about your daily routine.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Spanish',
      goal: 'Describe a simple daily routine in Spanish.',
      focus: 'buenos días, la mañana, trabajar, and estudiar',
    }),
  },
  {
    id: 'spanish-at-the-cafe',
    unitId: 'spanish-unit-3-cafe',
    languageId: 'spanish',
    order: 3,
    level: 'A1',
    format: 'ai-audio',
    title: 'En el café',
    description: 'Order a drink and respond politely at a café.',
    durationMinutes: 10,
    xpReward: 15,
    goal: {
      summary: 'Order a drink politely in a Spanish-speaking café.',
      outcomes: [
        'Ask for coffee or water.',
        'Use please and thank you naturally.',
      ],
    },
    vocabulary: [
      {
        id: 'spanish-cafe-coffee',
        term: 'el café',
        translation: 'coffee',
        pronunciation: 'el kah-FEH',
      },
      {
        id: 'spanish-cafe-water',
        term: 'el agua',
        translation: 'water',
        pronunciation: 'el AH-gwah',
      },
      {
        id: 'spanish-cafe-please',
        term: 'por favor',
        translation: 'please',
        pronunciation: 'por fah-VOR',
      },
    ],
    phrases: [
      {
        id: 'spanish-cafe-order',
        text: 'Quisiera un café, por favor.',
        translation: 'I would like a coffee, please.',
        pronunciation: 'kee-SYEH-rah oon kah-FEH por fah-VOR',
        usageNote: 'A polite way to order.',
      },
      {
        id: 'spanish-cafe-thanks',
        text: 'Muchas gracias.',
        translation: 'Thank you very much.',
        pronunciation: 'MOO-chahs GRAH-syahs',
      },
    ],
    activities: [
      {
        id: 'spanish-cafe-choice',
        type: 'multiple-choice',
        instruction: 'Choose the polite order.',
        prompt: 'How would you ask for a coffee?',
        expectedAnswer: 'Quisiera un café, por favor.',
        choices: [
          'Quisiera un café, por favor.',
          '¿Cómo te llamas?',
          'Buenos días.',
        ],
      },
      {
        id: 'spanish-cafe-roleplay',
        type: 'conversation',
        instruction: 'Order any drink from the teacher.',
        prompt: 'Hola, ¿qué desea?',
        expectedAnswer: 'Quisiera…, por favor.',
      },
    ],
    teacherOpeningLine:
      'Welcome to the café! Today you will order a drink politely in Spanish.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Spanish',
      goal: 'Order a drink politely in a Spanish-speaking café.',
      focus: 'quisiera, café, agua, por favor, and muchas gracias',
    }),
  },
  {
    id: 'spanish-travel-directions',
    unitId: 'spanish-unit-3-cafe',
    languageId: 'spanish',
    order: 4,
    level: 'A1',
    format: 'guided-practice',
    title: 'Viajes y direcciones',
    description: 'Ask where a place is and understand a basic direction.',
    durationMinutes: 10,
    xpReward: 15,
    goal: {
      summary: 'Ask for and follow a simple direction in Spanish.',
      outcomes: [
        'Ask where a place is.',
        'Understand left and right.',
      ],
    },
    vocabulary: [
      {
        id: 'spanish-directions-left',
        term: 'izquierda',
        translation: 'left',
        pronunciation: 'ees-KYEHR-dah',
      },
      {
        id: 'spanish-directions-right',
        term: 'derecha',
        translation: 'right',
        pronunciation: 'deh-REH-chah',
      },
      {
        id: 'spanish-directions-station',
        term: 'la estación',
        translation: 'the station',
        pronunciation: 'lah es-tah-SYOHN',
      },
    ],
    phrases: [
      {
        id: 'spanish-directions-where',
        text: '¿Dónde está la estación?',
        translation: 'Where is the station?',
        pronunciation: 'DOHN-deh es-TAH lah es-tah-SYOHN',
      },
      {
        id: 'spanish-directions-right',
        text: 'Está a la derecha.',
        translation: 'It is on the right.',
        pronunciation: 'es-TAH ah lah deh-REH-chah',
      },
    ],
    activities: [
      {
        id: 'spanish-directions-repeat',
        type: 'repeat',
        instruction: 'Repeat the question.',
        prompt: '¿Dónde está la estación?',
        expectedAnswer: '¿Dónde está la estación?',
      },
      {
        id: 'spanish-directions-translate',
        type: 'translate',
        instruction: 'Say this in Spanish.',
        prompt: 'It is on the left.',
        expectedAnswer: 'Está a la izquierda.',
      },
    ],
    teacherOpeningLine:
      'Imagine we are exploring a new city. Let’s learn how to ask for directions in Spanish.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Spanish',
      goal: 'Ask for and follow a simple direction in Spanish.',
      focus: 'dónde está, la estación, izquierda, and derecha',
    }),
  },
  {
    id: 'spanish-shopping',
    unitId: 'spanish-unit-3-cafe',
    languageId: 'spanish',
    order: 5,
    level: 'A1',
    format: 'guided-practice',
    title: 'De compras',
    description: 'Ask for a price and choose something you want.',
    durationMinutes: 9,
    xpReward: 15,
    goal: {
      summary: 'Ask about prices and buy a simple item in Spanish.',
      outcomes: [
        'Ask how much something costs.',
        'Say that you would like an item.',
      ],
    },
    vocabulary: [
      {
        id: 'spanish-shopping-price',
        term: 'el precio',
        translation: 'the price',
        pronunciation: 'el PREH-syoh',
      },
      {
        id: 'spanish-shopping-how-much',
        term: 'cuánto',
        translation: 'how much',
        pronunciation: 'KWAHN-toh',
      },
      {
        id: 'spanish-shopping-shirt',
        term: 'la camisa',
        translation: 'the shirt',
        pronunciation: 'lah kah-MEE-sah',
      },
    ],
    phrases: [
      {
        id: 'spanish-shopping-cost',
        text: '¿Cuánto cuesta?',
        translation: 'How much does it cost?',
        pronunciation: 'KWAHN-toh KWEHS-tah',
      },
      {
        id: 'spanish-shopping-this',
        text: 'Quisiera esta camisa.',
        translation: 'I would like this shirt.',
        pronunciation: 'kee-SYEH-rah EHS-tah kah-MEE-sah',
      },
    ],
    activities: [
      {
        id: 'spanish-shopping-listen',
        type: 'listen',
        instruction: 'Listen for the price question.',
        prompt: '¿Cuánto cuesta esta camisa?',
        expectedAnswer: 'How much does this shirt cost?',
      },
      {
        id: 'spanish-shopping-roleplay',
        type: 'conversation',
        instruction: 'Ask the shopkeeper for a price.',
        prompt: 'Hola, ¿puedo ayudarle?',
        expectedAnswer: '¿Cuánto cuesta?',
      },
    ],
    teacherOpeningLine:
      'Let’s go shopping! You will learn two useful ways to ask about and choose an item.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Spanish',
      goal: 'Ask about prices and buy a simple item in Spanish.',
      focus: 'cuánto cuesta, el precio, quisiera, and la camisa',
    }),
  },
  {
    id: 'spanish-family-friends',
    unitId: 'spanish-unit-3-cafe',
    languageId: 'spanish',
    order: 6,
    level: 'A1',
    format: 'review',
    title: 'Familia y amigos',
    description: 'Introduce the important people in your life.',
    durationMinutes: 10,
    xpReward: 20,
    goal: {
      summary: 'Talk briefly about family and friends in Spanish.',
      outcomes: [
        'Identify a family member or friend.',
        'Say someone’s name.',
      ],
    },
    vocabulary: [
      {
        id: 'spanish-family-family',
        term: 'la familia',
        translation: 'the family',
        pronunciation: 'lah fah-MEE-lyah',
      },
      {
        id: 'spanish-family-friend',
        term: 'el amigo / la amiga',
        translation: 'the friend',
        pronunciation: 'el ah-MEE-goh / lah ah-MEE-gah',
      },
      {
        id: 'spanish-family-sister',
        term: 'la hermana',
        translation: 'the sister',
        pronunciation: 'lah ehr-MAH-nah',
      },
    ],
    phrases: [
      {
        id: 'spanish-family-introduce',
        text: 'Esta es mi hermana.',
        translation: 'This is my sister.',
        pronunciation: 'EHS-tah es mee ehr-MAH-nah',
      },
      {
        id: 'spanish-family-friend-name',
        text: 'Mi amigo se llama Leo.',
        translation: 'My friend’s name is Leo.',
        pronunciation: 'mee ah-MEE-goh seh YAH-mah LEH-oh',
      },
    ],
    activities: [
      {
        id: 'spanish-family-repeat',
        type: 'repeat',
        instruction: 'Repeat the introduction.',
        prompt: 'Esta es mi hermana.',
        expectedAnswer: 'Esta es mi hermana.',
      },
      {
        id: 'spanish-family-conversation',
        type: 'conversation',
        instruction: 'Introduce a friend or family member.',
        prompt: '¿Quién es?',
        expectedAnswer: 'Este es mi… / Esta es mi…',
      },
    ],
    teacherOpeningLine:
      'In this review, you will introduce a friend or family member using simple Spanish.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Spanish',
      goal: 'Talk briefly about family and friends in Spanish.',
      focus: 'familia, amigo, amiga, este es, esta es, and se llama',
    }),
  },
  {
    id: 'french-greetings',
    unitId: 'french-unit-1-first-conversations',
    languageId: 'french',
    order: 1,
    level: 'A1',
    format: 'ai-audio',
    title: 'Salutations et présentations',
    description: 'Greet someone and say your name in French.',
    durationMinutes: 8,
    xpReward: 10,
    goal: {
      summary: 'Introduce yourself politely in French.',
      outcomes: ['Say hello.', 'Tell someone your name.'],
    },
    vocabulary: [
      {
        id: 'french-greetings-hello',
        term: 'bonjour',
        translation: 'hello',
        pronunciation: 'bohn-ZHOOR',
      },
      {
        id: 'french-greetings-name',
        term: 'le nom',
        translation: 'the name',
        pronunciation: 'luh nohn',
      },
    ],
    phrases: [
      {
        id: 'french-greetings-my-name',
        text: 'Je m’appelle Alex.',
        translation: 'My name is Alex.',
        pronunciation: 'zhuh mah-PELL Alex',
      },
      {
        id: 'french-greetings-nice',
        text: 'Enchanté.',
        translation: 'Nice to meet you.',
        pronunciation: 'ahn-shahn-TAY',
      },
    ],
    activities: [
      {
        id: 'french-greetings-repeat',
        type: 'repeat',
        instruction: 'Repeat the introduction.',
        prompt: 'Bonjour, je m’appelle Alex.',
        expectedAnswer: 'Bonjour, je m’appelle Alex.',
      },
      {
        id: 'french-greetings-conversation',
        type: 'conversation',
        instruction: 'Answer with your name.',
        prompt: 'Comment vous appelez-vous ?',
        expectedAnswer: 'Je m’appelle…',
      },
    ],
    teacherOpeningLine:
      'Bonjour! Today we will greet someone and introduce ourselves in French.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'French',
      goal: 'Introduce yourself politely in French.',
      focus: 'bonjour, je m’appelle, and enchanté',
    }),
  },
  {
    id: 'french-at-the-cafe',
    unitId: 'french-unit-1-first-conversations',
    languageId: 'french',
    order: 2,
    level: 'A1',
    format: 'ai-audio',
    title: 'Au café',
    description: 'Order a drink politely in French.',
    durationMinutes: 9,
    xpReward: 15,
    goal: {
      summary: 'Order a drink in a French café.',
      outcomes: ['Ask for coffee or water.', 'Say please and thank you.'],
    },
    vocabulary: [
      {
        id: 'french-cafe-coffee',
        term: 'un café',
        translation: 'a coffee',
        pronunciation: 'uhn kah-FAY',
      },
      {
        id: 'french-cafe-water',
        term: 'de l’eau',
        translation: 'water',
        pronunciation: 'duh loh',
      },
    ],
    phrases: [
      {
        id: 'french-cafe-order',
        text: 'Je voudrais un café, s’il vous plaît.',
        translation: 'I would like a coffee, please.',
        pronunciation: 'zhuh voo-DRAY uhn kah-FAY seel voo PLAY',
      },
      {
        id: 'french-cafe-thanks',
        text: 'Merci beaucoup.',
        translation: 'Thank you very much.',
        pronunciation: 'mehr-SEE boh-KOO',
      },
    ],
    activities: [
      {
        id: 'french-cafe-repeat',
        type: 'repeat',
        instruction: 'Repeat the polite order.',
        prompt: 'Je voudrais un café, s’il vous plaît.',
        expectedAnswer: 'Je voudrais un café, s’il vous plaît.',
      },
      {
        id: 'french-cafe-roleplay',
        type: 'conversation',
        instruction: 'Order a drink.',
        prompt: 'Bonjour, vous désirez ?',
        expectedAnswer: 'Je voudrais…, s’il vous plaît.',
      },
    ],
    teacherOpeningLine:
      'Welcome to our French café! Let’s practice ordering one drink politely.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'French',
      goal: 'Order a drink in a French café.',
      focus: 'je voudrais, un café, de l’eau, s’il vous plaît, and merci',
    }),
  },
  {
    id: 'japanese-greetings',
    unitId: 'japanese-unit-1-first-conversations',
    languageId: 'japanese',
    order: 1,
    level: 'A1',
    format: 'ai-audio',
    title: 'あいさつと自己紹介',
    description: 'Use a polite greeting and share your name.',
    durationMinutes: 8,
    xpReward: 10,
    goal: {
      summary: 'Greet someone and introduce yourself in Japanese.',
      outcomes: ['Say hello politely.', 'Tell someone your name.'],
    },
    vocabulary: [
      {
        id: 'japanese-greetings-hello',
        term: 'こんにちは',
        translation: 'hello',
        pronunciation: 'kohn-nee-chee-wah',
      },
      {
        id: 'japanese-greetings-name',
        term: 'なまえ',
        translation: 'name',
        pronunciation: 'nah-mah-eh',
      },
    ],
    phrases: [
      {
        id: 'japanese-greetings-my-name',
        text: 'わたしはアレックスです。',
        translation: 'I am Alex.',
        pronunciation: 'wah-tah-shee wah ah-reh-kkoo-soo dess',
      },
      {
        id: 'japanese-greetings-nice',
        text: 'はじめまして。',
        translation: 'Nice to meet you.',
        pronunciation: 'hah-jee-meh-mah-shee-teh',
      },
    ],
    activities: [
      {
        id: 'japanese-greetings-repeat',
        type: 'repeat',
        instruction: 'Repeat the greeting slowly.',
        prompt: 'こんにちは。はじめまして。',
        expectedAnswer: 'こんにちは。はじめまして。',
      },
      {
        id: 'japanese-greetings-conversation',
        type: 'conversation',
        instruction: 'Introduce yourself using your name.',
        prompt: 'おなまえは？',
        expectedAnswer: 'わたしは…です。',
      },
    ],
    teacherOpeningLine:
      'こんにちは! Today we will practice a polite Japanese greeting and introduction.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Japanese',
      goal: 'Greet someone and introduce yourself in Japanese.',
      focus: 'こんにちは, はじめまして, and わたしは…です',
    }),
  },
  {
    id: 'japanese-at-the-cafe',
    unitId: 'japanese-unit-1-first-conversations',
    languageId: 'japanese',
    order: 2,
    level: 'A1',
    format: 'ai-audio',
    title: 'カフェで',
    description: 'Order a drink with a simple polite phrase.',
    durationMinutes: 9,
    xpReward: 15,
    goal: {
      summary: 'Order a drink politely in Japanese.',
      outcomes: ['Name a drink.', 'Use the polite request word.'],
    },
    vocabulary: [
      {
        id: 'japanese-cafe-coffee',
        term: 'コーヒー',
        translation: 'coffee',
        pronunciation: 'koh-hee',
      },
      {
        id: 'japanese-cafe-water',
        term: 'みず',
        translation: 'water',
        pronunciation: 'mee-zoo',
      },
    ],
    phrases: [
      {
        id: 'japanese-cafe-order',
        text: 'コーヒーをください。',
        translation: 'Coffee, please.',
        pronunciation: 'koh-hee oh koo-dah-sigh',
      },
      {
        id: 'japanese-cafe-thanks',
        text: 'ありがとうございます。',
        translation: 'Thank you very much.',
        pronunciation: 'ah-ree-gah-toh goh-zah-ee-mahss',
      },
    ],
    activities: [
      {
        id: 'japanese-cafe-repeat',
        type: 'repeat',
        instruction: 'Repeat the order.',
        prompt: 'コーヒーをください。',
        expectedAnswer: 'コーヒーをください。',
      },
      {
        id: 'japanese-cafe-roleplay',
        type: 'conversation',
        instruction: 'Order coffee or water.',
        prompt: 'ごちゅうもんは？',
        expectedAnswer: '…をください。',
      },
    ],
    teacherOpeningLine:
      'Welcome to the café! Let’s learn one very useful Japanese ordering pattern.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Japanese',
      goal: 'Order a drink politely in Japanese.',
      focus: 'コーヒー, みず, …をください, and ありがとうございます',
    }),
  },
  {
    id: 'korean-greetings',
    unitId: 'korean-unit-1-first-conversations',
    languageId: 'korean',
    order: 1,
    level: 'A1',
    format: 'ai-audio',
    title: '인사와 자기소개',
    description: 'Say hello and introduce yourself politely.',
    durationMinutes: 8,
    xpReward: 10,
    goal: {
      summary: 'Greet someone and share your name in Korean.',
      outcomes: ['Say hello politely.', 'Say “I am…” with your name.'],
    },
    vocabulary: [
      {
        id: 'korean-greetings-hello',
        term: '안녕하세요',
        translation: 'hello',
        pronunciation: 'ahn-nyung-hah-seh-yoh',
      },
      {
        id: 'korean-greetings-name',
        term: '이름',
        translation: 'name',
        pronunciation: 'ee-room',
      },
    ],
    phrases: [
      {
        id: 'korean-greetings-my-name',
        text: '저는 알렉스예요.',
        translation: 'I am Alex.',
        pronunciation: 'juh-nuhn ahl-lek-suh-yeh-yoh',
      },
      {
        id: 'korean-greetings-nice',
        text: '만나서 반가워요.',
        translation: 'Nice to meet you.',
        pronunciation: 'mahn-nah-suh bahn-gah-wuh-yoh',
      },
    ],
    activities: [
      {
        id: 'korean-greetings-repeat',
        type: 'repeat',
        instruction: 'Repeat the polite greeting.',
        prompt: '안녕하세요.',
        expectedAnswer: '안녕하세요.',
      },
      {
        id: 'korean-greetings-conversation',
        type: 'conversation',
        instruction: 'Introduce yourself.',
        prompt: '이름이 뭐예요?',
        expectedAnswer: '저는 …예요.',
      },
    ],
    teacherOpeningLine:
      '안녕하세요! Today we will practice a friendly and polite Korean introduction.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Korean',
      goal: 'Greet someone and share your name in Korean.',
      focus: '안녕하세요, 이름, 저는 …예요, and 만나서 반가워요',
    }),
  },
  {
    id: 'korean-at-the-cafe',
    unitId: 'korean-unit-1-first-conversations',
    languageId: 'korean',
    order: 2,
    level: 'A1',
    format: 'ai-audio',
    title: '카페에서',
    description: 'Ask for a drink in a Korean café.',
    durationMinutes: 9,
    xpReward: 15,
    goal: {
      summary: 'Order one drink politely in Korean.',
      outcomes: ['Name coffee or water.', 'Use 주세요 for a polite request.'],
    },
    vocabulary: [
      {
        id: 'korean-cafe-coffee',
        term: '커피',
        translation: 'coffee',
        pronunciation: 'kuh-pee',
      },
      {
        id: 'korean-cafe-water',
        term: '물',
        translation: 'water',
        pronunciation: 'mool',
      },
    ],
    phrases: [
      {
        id: 'korean-cafe-order',
        text: '커피 주세요.',
        translation: 'Coffee, please.',
        pronunciation: 'kuh-pee joo-seh-yoh',
      },
      {
        id: 'korean-cafe-thanks',
        text: '감사합니다.',
        translation: 'Thank you.',
        pronunciation: 'gahm-sah-hahm-nee-dah',
      },
    ],
    activities: [
      {
        id: 'korean-cafe-repeat',
        type: 'repeat',
        instruction: 'Repeat the request.',
        prompt: '커피 주세요.',
        expectedAnswer: '커피 주세요.',
      },
      {
        id: 'korean-cafe-roleplay',
        type: 'conversation',
        instruction: 'Order coffee or water.',
        prompt: '무엇을 드릴까요?',
        expectedAnswer: '… 주세요.',
      },
    ],
    teacherOpeningLine:
      'Let’s visit a Korean café and practice one easy pattern for ordering a drink.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Korean',
      goal: 'Order one drink politely in Korean.',
      focus: '커피, 물, 주세요, and 감사합니다',
    }),
  },
  {
    id: 'german-greetings',
    unitId: 'german-unit-1-first-conversations',
    languageId: 'german',
    order: 1,
    level: 'A1',
    format: 'ai-audio',
    title: 'Begrüßungen und Vorstellungen',
    description: 'Say hello and tell someone your name.',
    durationMinutes: 8,
    xpReward: 10,
    goal: {
      summary: 'Introduce yourself in German.',
      outcomes: ['Use a common greeting.', 'Say your name.'],
    },
    vocabulary: [
      {
        id: 'german-greetings-hello',
        term: 'hallo',
        translation: 'hello',
        pronunciation: 'HAH-loh',
      },
      {
        id: 'german-greetings-name',
        term: 'der Name',
        translation: 'the name',
        pronunciation: 'dehr NAH-muh',
      },
    ],
    phrases: [
      {
        id: 'german-greetings-my-name',
        text: 'Ich heiße Alex.',
        translation: 'My name is Alex.',
        pronunciation: 'ikh HIGH-suh Alex',
      },
      {
        id: 'german-greetings-nice',
        text: 'Freut mich.',
        translation: 'Nice to meet you.',
        pronunciation: 'froyt mikh',
      },
    ],
    activities: [
      {
        id: 'german-greetings-repeat',
        type: 'repeat',
        instruction: 'Repeat the introduction.',
        prompt: 'Hallo, ich heiße Alex.',
        expectedAnswer: 'Hallo, ich heiße Alex.',
      },
      {
        id: 'german-greetings-conversation',
        type: 'conversation',
        instruction: 'Answer with your name.',
        prompt: 'Wie heißt du?',
        expectedAnswer: 'Ich heiße…',
      },
    ],
    teacherOpeningLine:
      'Hallo! Today we will learn a friendly German greeting and introduction.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'German',
      goal: 'Introduce yourself in German.',
      focus: 'hallo, ich heiße, wie heißt du, and freut mich',
    }),
  },
  {
    id: 'german-at-the-cafe',
    unitId: 'german-unit-1-first-conversations',
    languageId: 'german',
    order: 2,
    level: 'A1',
    format: 'ai-audio',
    title: 'Im Café',
    description: 'Order a drink politely in German.',
    durationMinutes: 9,
    xpReward: 15,
    goal: {
      summary: 'Order a drink in a German café.',
      outcomes: ['Ask for coffee or water.', 'Say please and thank you.'],
    },
    vocabulary: [
      {
        id: 'german-cafe-coffee',
        term: 'der Kaffee',
        translation: 'the coffee',
        pronunciation: 'dehr kah-FAY',
      },
      {
        id: 'german-cafe-water',
        term: 'das Wasser',
        translation: 'the water',
        pronunciation: 'dahs VAH-suhr',
      },
    ],
    phrases: [
      {
        id: 'german-cafe-order',
        text: 'Ich möchte einen Kaffee, bitte.',
        translation: 'I would like a coffee, please.',
        pronunciation: 'ikh MERKH-tuh EYE-nuhn kah-FAY BIT-tuh',
      },
      {
        id: 'german-cafe-thanks',
        text: 'Vielen Dank.',
        translation: 'Thank you very much.',
        pronunciation: 'FEE-luhn dahnk',
      },
    ],
    activities: [
      {
        id: 'german-cafe-repeat',
        type: 'repeat',
        instruction: 'Repeat the polite order.',
        prompt: 'Ich möchte einen Kaffee, bitte.',
        expectedAnswer: 'Ich möchte einen Kaffee, bitte.',
      },
      {
        id: 'german-cafe-roleplay',
        type: 'conversation',
        instruction: 'Order a drink.',
        prompt: 'Was möchten Sie?',
        expectedAnswer: 'Ich möchte…, bitte.',
      },
    ],
    teacherOpeningLine:
      'Welcome to the café! Let’s practice ordering a drink politely in German.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'German',
      goal: 'Order a drink in a German café.',
      focus: 'ich möchte, Kaffee, Wasser, bitte, and vielen Dank',
    }),
  },
  {
    id: 'chinese-greetings',
    unitId: 'chinese-unit-1-first-conversations',
    languageId: 'chinese',
    order: 1,
    level: 'A1',
    format: 'ai-audio',
    title: '问候与自我介绍',
    description: 'Say hello and share your name in Mandarin.',
    durationMinutes: 8,
    xpReward: 10,
    goal: {
      summary: 'Greet someone and introduce yourself in Mandarin Chinese.',
      outcomes: ['Say hello.', 'Tell someone your name.'],
    },
    vocabulary: [
      {
        id: 'chinese-greetings-hello',
        term: '你好',
        translation: 'hello',
        pronunciation: 'nǐ hǎo',
      },
      {
        id: 'chinese-greetings-name',
        term: '名字',
        translation: 'name',
        pronunciation: 'míngzi',
      },
    ],
    phrases: [
      {
        id: 'chinese-greetings-my-name',
        text: '我叫 Alex。',
        translation: 'My name is Alex.',
        pronunciation: 'wǒ jiào Alex',
      },
      {
        id: 'chinese-greetings-nice',
        text: '很高兴认识你。',
        translation: 'Nice to meet you.',
        pronunciation: 'hěn gāoxìng rènshi nǐ',
      },
    ],
    activities: [
      {
        id: 'chinese-greetings-repeat',
        type: 'repeat',
        instruction: 'Repeat the greeting.',
        prompt: '你好。',
        expectedAnswer: '你好。',
      },
      {
        id: 'chinese-greetings-conversation',
        type: 'conversation',
        instruction: 'Answer with your name.',
        prompt: '你叫什么名字？',
        expectedAnswer: '我叫…',
      },
    ],
    teacherOpeningLine:
      '你好! Today we will practice a simple Mandarin greeting and introduction.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Mandarin Chinese',
      goal: 'Greet someone and introduce yourself in Mandarin Chinese.',
      focus: '你好, 名字, 我叫, and 很高兴认识你',
    }),
  },
  {
    id: 'chinese-at-the-cafe',
    unitId: 'chinese-unit-1-first-conversations',
    languageId: 'chinese',
    order: 2,
    level: 'A1',
    format: 'ai-audio',
    title: '在咖啡馆',
    description: 'Order a drink with a simple Mandarin phrase.',
    durationMinutes: 9,
    xpReward: 15,
    goal: {
      summary: 'Order one drink politely in Mandarin Chinese.',
      outcomes: ['Name tea or water.', 'Use a polite request.'],
    },
    vocabulary: [
      {
        id: 'chinese-cafe-tea',
        term: '茶',
        translation: 'tea',
        pronunciation: 'chá',
      },
      {
        id: 'chinese-cafe-water',
        term: '水',
        translation: 'water',
        pronunciation: 'shuǐ',
      },
    ],
    phrases: [
      {
        id: 'chinese-cafe-order',
        text: '请给我一杯茶。',
        translation: 'Please give me a cup of tea.',
        pronunciation: 'qǐng gěi wǒ yì bēi chá',
      },
      {
        id: 'chinese-cafe-thanks',
        text: '谢谢。',
        translation: 'Thank you.',
        pronunciation: 'xièxie',
      },
    ],
    activities: [
      {
        id: 'chinese-cafe-repeat',
        type: 'repeat',
        instruction: 'Repeat the order slowly.',
        prompt: '请给我一杯茶。',
        expectedAnswer: '请给我一杯茶。',
      },
      {
        id: 'chinese-cafe-roleplay',
        type: 'conversation',
        instruction: 'Order tea or water.',
        prompt: '您要什么？',
        expectedAnswer: '请给我…',
      },
    ],
    teacherOpeningLine:
      'Let’s order a drink in Mandarin using one simple and polite sentence pattern.',
    aiTeacherPrompt: createTeacherPrompt({
      language: 'Mandarin Chinese',
      goal: 'Order one drink politely in Mandarin Chinese.',
      focus: '茶, 水, 请给我, 一杯, and 谢谢',
    }),
  },
  ...supplementalLessons,
];

export function getLessonsByLanguage(languageId: LanguageId) {
  return lessons
    .filter((lesson) => lesson.languageId === languageId)
    .sort((firstLesson, secondLesson) => firstLesson.order - secondLesson.order);
}

export function getLessonsByUnit(unitId: string) {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((firstLesson, secondLesson) => firstLesson.order - secondLesson.order);
}

export function getLessonById(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}
