import { Response } from 'express';

import { IcmError } from './icm.error';
import { getLogger } from './logger';

const logger = getLogger('UCP');

/**
 * UCP distinguishes two error classes:
 *  - Protocol/server errors -> real HTTP status codes with an `error` envelope.
 *  - Business-logic outcomes -> HTTP 200 with a `messages` array (handled in the routes).
 *
 * This helper maps thrown protocol/backend errors onto UCP error responses.
 * Backend details are logged but never exposed to the client (OWASP A05:2021).
 */
export function sendUcpError(res: Response, error: unknown): void {
  if (error instanceof IcmError) {
    logger.error({ http: { response: { status_code: error.status } } }, 'ICM backend error');
    // Surface upstream availability/auth issues as a bad gateway; pass through client errors.
    const status = error.status >= 500 || error.status === 401 || error.status === 403 ? 502 : error.status;
    res.status(status).json({
      error: { type: 'backend_error', message: 'The commerce backend rejected the request.' },
    });
    return;
  }

  logger.error({ error: { message: error instanceof Error ? error.message : String(error) } }, 'Unhandled UCP error');
  res.status(500).json({
    error: { type: 'internal_error', message: 'Unexpected error while processing the UCP request.' },
  });
}
