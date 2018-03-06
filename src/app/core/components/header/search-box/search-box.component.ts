// NEEDS_WORK: review and adapt (search-box results in javascript error when used in french)
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SuggestTerm } from '../../../../models/suggest-term/suggest-term.model';

@Component({
  selector: 'ish-search-box',
  templateUrl: './search-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent implements OnChanges {

  @Input() results: SuggestTerm[];
  @Input() searchButtonText: string;
  @Input() searchTerm: string;
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() performSearch = new EventEmitter<string>();

  isHide = true;

  hidePopup() {
    if (this.results) {
      this.isHide = true;
    }
  }

  ngOnChanges() {
    const resultsAvailable = !!this.results && this.results.length > 0;
    this.isHide = !resultsAvailable;
  }

  search(searchTerm: string) {
    this.searchTermChange.emit(searchTerm);
  }

  onSubmit(searchTerm: string) {
    if (searchTerm) {
      this.performSearch.emit(searchTerm);
    }
    return false;
  }
}
