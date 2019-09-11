import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { SearchBoxConfiguration } from 'ish-shell/header/configurations/search-box.configuration';

/**
 * displays the search box with search button
 *
 * @example
 * <ish-search-box
 *               [configuration] = "{ maxAutoSuggests: 3 }"
 *               [results]="searchResults$ | async"
 *               [searchTerm]="previousSearchTerm$ | async"
 *               (searchTermChange)="suggestSearch($event)"
 *               (performSearch)="performSearch($event)"
 * ></ish-search-box>
 */
@Component({
  selector: 'ish-search-box',
  templateUrl: './search-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent implements OnChanges {
  @Input() configuration: SearchBoxConfiguration = { id: 'default' };
  @Input() searchTermLatest: string;
  @Input() searchTermCurrent: string;
  @Input() results: SuggestTerm[];
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() performSearch = new EventEmitter<string>();

  isHidden = true;
  activeIndex = -1;
  currentSearchTerm = '';
  formSubmitted = false;

  ngOnChanges(c: SimpleChanges) {
    if (c.searchTermCurrent) {
      this.currentSearchTerm = c.searchTermCurrent.currentValue;
    }
  }

  hidePopup() {
    this.isHidden = true;
    this.activeIndex = -1;
  }

  searchSuggest(searchTerm: string) {
    this.isHidden = !searchTerm;
    this.formSubmitted = false;
    this.currentSearchTerm = searchTerm;
    this.searchTermChange.emit(searchTerm);
  }

  submitSearch() {
    this.isHidden = true;
    this.formSubmitted = true;
    if (this.activeIndex > -1) {
      this.currentSearchTerm = this.results[this.activeIndex].term;
    }
    if (this.currentSearchTerm) {
      this.hidePopup();
      this.performSearch.emit(this.currentSearchTerm);
    }
    return false;
  }

  submitSuggestedTerm(suggestedTerm: string) {
    this.currentSearchTerm = suggestedTerm;
    this.submitSearch();
  }

  selectSuggestedTerm(index: number) {
    if (
      this.isHidden ||
      (this.configuration && this.configuration.maxAutoSuggests && index > this.configuration.maxAutoSuggests - 1) ||
      index < -1 ||
      index > this.results.length - 1
    ) {
      return;
    }
    this.activeIndex = index;
  }

  isActiveSuggestedTerm(index: number) {
    return this.activeIndex === index;
  }
}
