import { AudioLessonScreen } from '@/components/audio-lesson-screen';
import { StreamVideoProvider } from '@/components/stream-video-provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AudioLessonRoute() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StreamVideoProvider>
          <AudioLessonScreen />
        </StreamVideoProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
