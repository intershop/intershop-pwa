/**
 * To support special characters (slash, percent and plus char) of user defined URI Components (like login, email, ...).
 * This method encodes a given resource ID in a way that can be processed by ICM.
 * REST API of ICM version pre 12.0 encode the URI components twice, because of former restriction of the httpd.
 *
 * @param resourceID    The resource ID to be encoded.
 * @returns             The encoded resource ID.
 */
export function encodeResourceID(resourceID: string): string {
  return encodeURIComponent(encodeURIComponent(resourceID));
  // ICM 12.0.0 (estimated release)
  // return encodeURIComponent(resourceID);
}
