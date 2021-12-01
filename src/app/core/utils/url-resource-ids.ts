/**
 * Encodes a given resource ID in a way that can be processed by ICM.
 * To support e.g. special characters in email addresses, like '+', double encoding is necessary.
 *
 * @param resourceID    The resource ID to be encoded.
 * @returns             The encoded resource ID.
 */
export function encodeResourceID(resourceID: string): string {
  return encodeURIComponent(encodeURIComponent(resourceID));
}
