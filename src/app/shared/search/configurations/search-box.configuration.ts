export interface SearchBoxConfiguration {
  /**
   * text for search button on search box, icon is used if no text is provided
   */
  buttonText?: string;
  /**
   * placeholder text for search input field
   */
  placeholderText?: string;
  /**
   * if autoSuggest is set to true auto suggestion is provided for search box, else no auto suggestion is provided
   */
  autoSuggest?: boolean;
  /**
   * configures the number of suggestions if auto suggestion is provided
   */
  maxAutoSuggests?: number;
}
