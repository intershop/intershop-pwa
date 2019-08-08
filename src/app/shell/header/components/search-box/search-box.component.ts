// NEEDS_WORK: review and adapt (search-box results in javascript error when used in french)
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { SearchBoxConfiguration } from '../../configurations/search-box.configuration';

// TODO: implement without ReactiveFormsModule so shell.module does not depend on it
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
  @Input() searchTerm: string;
  @Input() results: SuggestTerm[];
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() performSearch = new EventEmitter<string>();

  isHidden = true;
  activeIndex = -1;
  currentSearchTerm = '';

  ngOnChanges(c: SimpleChanges) {
    this.updateSearchTerm(c.searchTerm);
    this.updatePopupStatus(c);
  }

  private updatePopupStatus(c: SimpleChanges) {
    if (c.results) {
      const resultsAvailable = !!this.results && this.results.length > 0 && !!this.currentSearchTerm;
      this.isHidden = !resultsAvailable;
    }
  }

  private updateSearchTerm(searchTerm: SimpleChange) {
    if (searchTerm) {
      this.currentSearchTerm = this.searchTerm;
    }
  }

  hidePopup() {
    this.isHidden = true;
    this.activeIndex = -1;
  }

  search(searchTerm: string) {
    this.currentSearchTerm = searchTerm;
    this.searchTermChange.emit(searchTerm);
  }

  submitSearch() {
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
