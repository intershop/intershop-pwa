/**
 * Opaque, offset-based pagination cursors for the catalog search endpoint.
 *
 * UCP cursors are opaque to clients; this implementation encodes the ICM result
 * offset as a base64url string.
 */

export function encodeCursor(offset: number): string {
  return Buffer.from(String(offset), 'utf8').toString('base64url');
}

export function decodeCursor(cursor: string | undefined): number {
  if (!cursor) {
    return 0;
  }
  const offset = Number(Buffer.from(cursor, 'base64url').toString('utf8'));
  return Number.isInteger(offset) && offset >= 0 ? offset : 0;
}
