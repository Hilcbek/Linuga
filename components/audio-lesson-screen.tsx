import { Platform } from 'react-native';

import type { AudioLessonScreen as NativeAudioLessonScreen } from './audio-lesson-screen.native';
import { AudioLessonScreen as WebAudioLessonScreen } from './audio-lesson-screen.web';

interface NativeAudioLessonModule {
  AudioLessonScreen: typeof NativeAudioLessonScreen;
}

const nativeModule =
  Platform.OS === 'web'
    ? null
    // WebRTC's native view cannot be evaluated by Expo's web/server renderer.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    : (require('./audio-lesson-screen.native') as NativeAudioLessonModule);

export const AudioLessonScreen =
  nativeModule?.AudioLessonScreen ?? WebAudioLessonScreen;
