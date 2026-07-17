import { createContext, useContext } from 'react';

export type StreamVideoConnectionStatus = 'error';

interface StreamVideoConnectionValue {
  client?: never;
  error: string;
  retry: () => void;
  status: StreamVideoConnectionStatus;
}

const webValue: StreamVideoConnectionValue = {
  error: 'Live audio lessons are available in the Lingua mobile app.',
  retry: () => undefined,
  status: 'error',
};

const StreamVideoConnectionContext =
  createContext<StreamVideoConnectionValue>(webValue);

interface StreamVideoProviderProps {
  children: React.ReactNode;
}

export function StreamVideoProvider({ children }: StreamVideoProviderProps) {
  return (
    <StreamVideoConnectionContext.Provider value={webValue}>
      {children}
    </StreamVideoConnectionContext.Provider>
  );
}

export function useStreamVideoConnection() {
  return useContext(StreamVideoConnectionContext);
}
