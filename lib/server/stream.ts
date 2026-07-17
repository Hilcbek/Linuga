import { StreamClient } from '@stream-io/node-sdk';

let streamClient: StreamClient | undefined;
let streamClientApiKey: string | undefined;
let streamClientApiSecret: string | undefined;

export class StreamConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StreamConfigurationError';
  }
}

function readEnvironmentValue(value: string | undefined) {
  const normalizedValue = value?.trim();
  return normalizedValue || undefined;
}

function isPlaceholder(value: string) {
  return /^(?:replace_me|your[_-].+|stream[_-]api[_-](?:key|secret))$/i.test(
    value,
  );
}

function getStreamCredentials() {
  const apiKey = readEnvironmentValue(
    process.env.STREAM_API_KEY ?? process.env.EXPO_PUBLIC_STREAM_API_KEY,
  );
  const apiSecret =
    readEnvironmentValue(process.env.STREAM_API_SECRET) ??
    readEnvironmentValue(process.env.STREAM_SECRET);

  if (!apiKey || !apiSecret) {
    throw new StreamConfigurationError(
      'Stream server credentials are not configured. Set STREAM_API_KEY and STREAM_API_SECRET.',
    );
  }

  if (
    isPlaceholder(apiKey) ||
    isPlaceholder(apiSecret) ||
    apiKey === apiSecret
  ) {
    throw new StreamConfigurationError(
      'Stream server credentials are invalid. Use the API key and secret from the same Stream app.',
    );
  }

  return { apiKey, apiSecret };
}

export function getStreamServer() {
  const credentials = getStreamCredentials();

  if (
    !streamClient ||
    streamClientApiKey !== credentials.apiKey ||
    streamClientApiSecret !== credentials.apiSecret
  ) {
    streamClient = new StreamClient(
      credentials.apiKey,
      credentials.apiSecret,
    );
    streamClientApiKey = credentials.apiKey;
    streamClientApiSecret = credentials.apiSecret;
  }

  return {
    apiKey: credentials.apiKey,
    client: streamClient,
  };
}
