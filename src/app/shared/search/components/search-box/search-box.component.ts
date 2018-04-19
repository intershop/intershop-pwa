// NEEDS_WORK: review and adapt (search-box results in javascript error when used in french)
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { SuggestTerm } from '../../../../models/suggest-term/suggest-term.model';

/**
 * displays the search box with search button
 *
 * @example
 * <ish-search-box
 *               [buttonText]="buttonText"
 *               [placeholderText] ="placeholderText"
 *               [autoSuggest] = "autoSuggest"
 *               [maxAutoSuggests] = "maxAutoSuggests"
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
export class SearchBoxComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * text for search button on search box
   * glyphicon is used if no text is provided
   */
  @Input() buttonText?: string;
  /**
   * placeholder text for search input field
   */
  @Input() placeholderText = '';
  /**
   * if autoSuggest is set to true auto suggestion is provided for search box, else no auto suggestion is provided
   */
  @Input() autoSuggest: boolean;
  /**
   * configures the number of suggestions if auto suggestion is provided
   */
  @Input() maxAutoSuggests: number;
  @Input() searchTerm: string;
  @Input() results: SuggestTerm[];
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() performSearch = new EventEmitter<string>();

  destroy$ = new Subject();
  searchForm: FormGroup;
  isHidden = true;
  activeIndex = -1;

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });

    if (this.autoSuggest) {
      this.searchForm
        .get('search')
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(this.searchTermChange);
    }
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.results) {
      const resultsAvailable = !!this.results && this.results.length > 0;
      this.isHidden = !resultsAvailable;
    }

    if (c.searchTerm) {
      this.setSearchFormValue(this.searchTerm);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  hidePopup() {
    this.isHidden = true;
    this.activeIndex = -1;
  }

  search(searchTerm: string) {
    this.searchTermChange.emit(searchTerm);
  }

  submitSearch() {
    if (this.activeIndex > -1) {
      this.setSearchFormValue(this.results[this.activeIndex].term);
    }
    const { search } = this.searchForm.value;
    if (search) {
      this.hidePopup();
      this.performSearch.emit(search);
    }
  }

  submitSuggestedTerm(suggestedTerm: string) {
    this.setSearchFormValue(suggestedTerm);
    this.submitSearch();
  }

  selectSuggestedTerm(index: number) {
    if (
      this.isHidden ||
      (this.maxAutoSuggests && index > this.maxAutoSuggests - 1) ||
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

  private setSearchFormValue(value: string) {
    // TODO: check why this method can be called before there is a searchForm
    if (this.searchForm) {
      this.searchForm.patchValue(
        {
          search: value,
        },
        { emitEvent: false }
      );
    }
  }
}
