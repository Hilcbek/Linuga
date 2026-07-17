import { Platform } from 'react-native';

import type {
  StreamVideoProvider as NativeStreamVideoProvider,
  useStreamVideoConnection as useNativeStreamVideoConnection,
} from './stream-video-provider.native';
import {
  StreamVideoProvider as WebStreamVideoProvider,
  useStreamVideoConnection as useWebStreamVideoConnection,
} from './stream-video-provider.web';

interface NativeStreamVideoModule {
  StreamVideoProvider: typeof NativeStreamVideoProvider;
  useStreamVideoConnection: typeof useNativeStreamVideoConnection;
}

const nativeModule =
  Platform.OS === 'web'
    ? null
    // The native SDK must not be evaluated by Expo's web/server renderer.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    : (require('./stream-video-provider.native') as NativeStreamVideoModule);

export const StreamVideoProvider =
  nativeModule?.StreamVideoProvider ?? WebStreamVideoProvider;

export const useStreamVideoConnection =
  nativeModule?.useStreamVideoConnection ?? useWebStreamVideoConnection;
