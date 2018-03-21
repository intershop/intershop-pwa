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

  @Input() results: SuggestTerm[];
  @Input() buttonText: string;
  @Input() buttonTitleText: string;
  @Input() placeholderText: string;
  @Input() searchTerm: string;
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() performSearch = new EventEmitter<string>();

  isHidden = true;

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });

    this.searchForm.get('search').valueChanges.subscribe(this.searchTermChange);
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
  }

  search(searchTerm: string) {
    this.searchTermChange.emit(searchTerm);
  }

  submitSearch() {
    const { search } = this.searchForm.value;
    if (search) {
      this.performSearch.emit(search);
    }
  }

  private setSearchFormValue(value: string) {
    // TODO: check why this method can be called before there is a searchForm
    if (this.searchForm) {
      this.searchForm.patchValue({
        search: this.searchTerm
      }, { emitEvent: false });
    }
  }
}
