import { verifyToken } from '@clerk/backend';
import { decodeJwt, verifyJwt } from '@clerk/backend/jwt';

import { StreamConfigurationError } from '@/lib/server/stream';
import { VisionAgentServiceError } from '@/lib/server/vision-agent';

interface ClerkJsonWebKey extends JsonWebKey {
  kid?: string;
}

interface ClerkJwksResponse {
  keys?: ClerkJsonWebKey[];
}

const clerkJwksCache = new Map<string, ClerkJsonWebKey[]>();

function isStreamAuthenticationError(error: unknown) {
  if (!(error instanceof Error) || !('metadata' in error)) {
    return false;
  }

  const metadata = error.metadata;

  return (
    typeof metadata === 'object' &&
    metadata !== null &&
    'responseCode' in metadata &&
    metadata.responseCode === 401
  );
}

export class ApiRouteError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiRouteError';
  }
}

function getClerkFrontendApi(publishableKey: string) {
  const encodedKey = publishableKey.replace(/^pk_(?:test|live)_/, '');

  if (encodedKey === publishableKey) {
    throw new ApiRouteError('The Clerk publishable key is invalid.', 500);
  }

  try {
    const normalizedKey = encodedKey
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(encodedKey.length / 4) * 4, '=');
    const decodedKey = atob(normalizedKey);
    const frontendApi = decodedKey.endsWith('$')
      ? decodedKey.slice(0, -1)
      : decodedKey;

    if (!/^[a-z0-9.-]+$/i.test(frontendApi)) {
      throw new Error('Invalid Clerk Frontend API host.');
    }

    return frontendApi;
  } catch {
    throw new ApiRouteError('The Clerk publishable key is invalid.', 500);
  }
}

async function fetchClerkJwks(frontendApi: string) {
  const response = await fetch(`https://${frontendApi}/.well-known/jwks.json`);

  if (!response.ok) {
    throw new Error(`Clerk JWKS request failed with status ${response.status}.`);
  }

  const body = (await response.json()) as ClerkJwksResponse;

  if (!Array.isArray(body.keys) || body.keys.length === 0) {
    throw new Error('Clerk JWKS response did not include signing keys.');
  }

  clerkJwksCache.set(frontendApi, body.keys);
  return body.keys;
}

async function verifyTokenWithPublishableKey(
  token: string,
  publishableKey: string,
) {
  const frontendApi = getClerkFrontendApi(publishableKey);
  const { header } = decodeJwt(token);
  let keys = clerkJwksCache.get(frontendApi);
  let signingKey = keys?.find((key) => key.kid === header.kid);

  if (!signingKey) {
    keys = await fetchClerkJwks(frontendApi);
    signingKey = keys.find((key) => key.kid === header.kid);
  }

  if (!signingKey) {
    throw new Error('Clerk signing key was not found.');
  }

  const claims = await verifyJwt(token, { key: signingKey });

  if (claims.iss !== `https://${frontendApi}`) {
    throw new Error('Clerk token issuer does not match this application.');
  }

  return claims;
}

export async function requireClerkUserId(request: Request) {
  const authorization = request.headers.get('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : null;

  if (!token) {
    throw new ApiRouteError('You must be signed in to start a lesson.', 401);
  }

  try {
    const secretKey = process.env.CLERK_SECRET_KEY;
    const jwtKey = process.env.CLERK_JWT_KEY;
    const publishableKey =
      process.env.CLERK_PUBLISHABLE_KEY ??
      process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const claims =
      secretKey || jwtKey
        ? await verifyToken(token, { jwtKey, secretKey })
        : publishableKey
          ? await verifyTokenWithPublishableKey(token, publishableKey)
          : null;

    if (!claims) {
      throw new ApiRouteError(
        'Clerk server authentication is not configured.',
        500,
      );
    }

    if (!claims.sub) {
      throw new Error('Clerk token is missing a subject.');
    }

    return claims.sub;
  } catch (error) {
    if (error instanceof ApiRouteError) {
      throw error;
    }

    throw new ApiRouteError('Your sign-in session could not be verified.', 401);
  }
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiRouteError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof VisionAgentServiceError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof StreamConfigurationError) {
    console.error(error.message);

    return Response.json({ error: error.message }, { status: 503 });
  }

  if (isStreamAuthenticationError(error)) {
    const message =
      'Stream server credentials were rejected. Copy the API key and secret from the same Stream app, then restart Expo.';

    console.error(message);

    return Response.json({ error: message }, { status: 503 });
  }

  console.error('Unexpected Stream API route error', error);

  return Response.json(
    { error: 'The audio lesson service is temporarily unavailable.' },
    { status: 500 },
  );
}
