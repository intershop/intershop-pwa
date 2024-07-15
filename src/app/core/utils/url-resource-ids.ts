/**
 * To support special characters (slash, percent and plus char) of user defined URI Components (like login, email, ...).
 * This method encodes a given resource ID in a way that can be processed by ICM.
 * REST API of ICM version pre 12.0 encode the URI components twice, because of former restriction of the httpd.
 *
 * @param resourceID    The resource ID to be encoded.
 * @returns             The encoded resource ID.
 */
export function encodeResourceID(resourceID: string): string {
  // ICM 7.10 & ICM 11 resource ID encoding
  //return encodeURIComponent(encodeURIComponent(resourceID));

  // ICM 12 and above resource ID encoding
  // encodeURIComponent replaces spaces with '+' that's not RFC conform.
  // Therefore, we encode existing '+' with '%2B', converting the string with encodeURIComponent,
  // and converting '%2B' ('%252B' after encodeURIComponent) to '+' back.
  return encodeURIComponent(resourceID?.replaceAll('+', '%2B'))?.replaceAll('\\+', '%20')?.replaceAll('%252B', '+');
}
