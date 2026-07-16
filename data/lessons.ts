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

export const lessons: Lesson[] = [
  {
    id: 'spanish-greetings',
    unitId: 'spanish-unit-3-cafe',
    languageId: 'spanish',
    order: 1,
    level: 'A1',
    format: 'ai-audio',
    title: 'Greetings & Introductions',
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
    title: 'Daily Life',
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
    title: 'At the Café',
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
    title: 'Travel & Directions',
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
    title: 'Shopping',
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
    title: 'Family & Friends',
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
    title: 'Greetings & Introductions',
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
    title: 'At the Café',
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
    title: 'Greetings & Introductions',
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
    title: 'At the Café',
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
    title: 'Greetings & Introductions',
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
    title: 'At the Café',
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
    title: 'Greetings & Introductions',
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
    title: 'At the Café',
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
    title: 'Greetings & Introductions',
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
    title: 'At the Café',
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
