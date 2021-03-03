import { IconName } from '@fortawesome/fontawesome-common-types';

export interface SearchBoxConfiguration {
  /**
   * text for search button on search box, icon is used if no text is provided
   */
  buttonText?: string;
  /**
   * placeholder text for search input field
   */
  placeholder?: string;
  /**
   * if autoSuggest is set to true auto suggestion is provided for search box, else no auto suggestion is provided
   */
  autoSuggest?: boolean;
  /**
   * configures the number of suggestions if auto suggestion is provided
   */
  maxAutoSuggests?: number;
  /**
   * configure search box icon
   */
  icon?: IconName;
  /**
   * show last search term as search box value
   */
  showLastSearchTerm?: boolean;
}
