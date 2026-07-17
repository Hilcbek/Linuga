import { useAuth, useUser } from '@clerk/expo';
import {
  type DeepPartial,
  StreamVideo,
  StreamVideoClient,
  type Theme,
  type User,
} from '@stream-io/video-react-native-sdk';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchStreamSession } from '@/lib/stream-api';

export type StreamVideoConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'ready'
  | 'error';

interface StreamVideoConnectionValue {
  client?: StreamVideoClient;
  error?: string;
  retry: () => void;
  status: StreamVideoConnectionStatus;
}

const StreamVideoConnectionContext =
  createContext<StreamVideoConnectionValue | null>(null);

interface StreamVideoProviderProps {
  children: React.ReactNode;
}

function StreamVideoWithInsets({
  children,
  client,
}: StreamVideoProviderProps & { client: StreamVideoClient }) {
  const { top, right, bottom, left } = useSafeAreaInsets();
  const theme = useMemo(
    () =>
      ({
        variants: { insets: { top, right, bottom, left } },
      }) as unknown as DeepPartial<Theme>,
    [bottom, left, right, top],
  );

  return (
    <StreamVideo client={client} style={theme}>
      {children}
    </StreamVideo>
  );
}

export function StreamVideoProvider({ children }: StreamVideoProviderProps) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const getTokenRef = useRef(getToken);
  const [client, setClient] = useState<StreamVideoClient>();
  const [error, setError] = useState<string>();
  const [retryKey, setRetryKey] = useState(0);
  const [status, setStatus] = useState<StreamVideoConnectionStatus>('idle');
  const userId = user?.id;
  const userImageUrl = user?.imageUrl;
  const userName = user
    ? (user.fullName ??
      user.firstName ??
      user.primaryEmailAddress?.emailAddress ??
      'Lingua learner')
    : undefined;

  getTokenRef.current = getToken;

  const retry = useCallback(() => {
    setError(undefined);
    setRetryKey((current) => current + 1);
  }, []);

  const tokenProvider = useCallback(async () => {
    const session = await fetchStreamSession(() => getTokenRef.current());
    return session.token;
  }, []);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId || !userName) {
      setClient(undefined);
      setError(undefined);
      setStatus('idle');
      return;
    }

    let cancelled = false;
    let connectedClient: StreamVideoClient | undefined;

    setError(undefined);
    setStatus('connecting');

    (async () => {
      const session = await fetchStreamSession(() => getTokenRef.current());

      if (cancelled) return;

      const streamUser: User = {
        id: session.userId,
        image: userImageUrl,
        name: userName,
      };

      connectedClient = StreamVideoClient.getOrCreateInstance({
        apiKey: session.apiKey,
        token: session.token,
        tokenProvider,
        user: streamUser,
      });

      setClient(connectedClient);
      setStatus('ready');
    })().catch((connectionError: unknown) => {
      if (cancelled) return;

      setClient(undefined);
      setError(
        connectionError instanceof Error
          ? connectionError.message
          : 'Could not connect to the audio lesson service.',
      );
      setStatus('error');
    });

    return () => {
      cancelled = true;
      setClient(undefined);
      connectedClient?.disconnectUser().catch((disconnectError: unknown) => {
        console.error('Failed to disconnect Stream Video', disconnectError);
      });
    };
  }, [
    isLoaded,
    isSignedIn,
    retryKey,
    tokenProvider,
    userId,
    userImageUrl,
    userName,
  ]);

  const value = useMemo<StreamVideoConnectionValue>(
    () => ({ client, error, retry, status }),
    [client, error, retry, status],
  );

  const content = (
    <StreamVideoConnectionContext.Provider value={value}>
      {children}
    </StreamVideoConnectionContext.Provider>
  );

  return client ? (
    <StreamVideoWithInsets client={client}>{content}</StreamVideoWithInsets>
  ) : (
    content
  );
}

export function useStreamVideoConnection() {
  const context = useContext(StreamVideoConnectionContext);

  if (!context) {
    throw new Error(
      'useStreamVideoConnection must be used inside StreamVideoProvider.',
    );
  }

  return context;
}
