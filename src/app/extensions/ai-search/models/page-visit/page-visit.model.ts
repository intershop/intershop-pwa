/**
 * A page the buyer navigated to.
 */
export interface PageVisit {
  /** URL path without query parameters and fragment. */
  path: string;
  /** The search query, only for a search results page. */
  searchQuery: string;
  /** Whether the page is shown again by a reload or by browser back or forward navigation. */
  restored: boolean;
}
