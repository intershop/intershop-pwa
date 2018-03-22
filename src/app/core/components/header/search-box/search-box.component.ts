// NEEDS_WORK: review and adapt (search-box results in javascript error when used in french)
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SuggestTerm } from '../../../../models/suggest-term/suggest-term.model';

@Component({
  selector: 'ish-search-box',
  templateUrl: './search-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent implements OnChanges, OnInit {

  searchForm: FormGroup;

  @Input() buttonText: string;
  @Input() buttonTitleText: string;
  @Input() placeholderText: string;
  @Input() autoSuggest: boolean;
  @Input() maxAutoSuggests: number;
  @Input() searchTerm: string;
  @Input() results: SuggestTerm[];
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() performSearch = new EventEmitter<string>();

  isHidden = true;
  activeIndex = -1;

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });

    if (this.autoSuggest) {
      this.searchForm.get('search').valueChanges.subscribe(this.searchTermChange);
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
    if (this.isHidden ||
      (this.maxAutoSuggests && index > this.maxAutoSuggests - 1) ||
      (index < -1) ||
      (index > this.results.length - 1)
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
      this.searchForm.patchValue({
        search: value
      }, { emitEvent: false });
    }
  }
}
