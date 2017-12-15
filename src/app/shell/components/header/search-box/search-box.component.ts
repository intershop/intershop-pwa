// NEEDS_WORK: review and adapt (search-box results in javascript error when used in french)
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SuggestTerm } from '../../../../models/suggest-term.model';
import { SuggestService } from '../../../../shared/services/suggest/suggest.service';

@Component({
  selector: 'ish-search-box',
  templateUrl: './search-box.component.html'
})


export class SearchBoxComponent implements OnInit {

  results: SuggestTerm[];
  searchTerm$ = new Subject<string>();
  isHide = false;
  searchButtonText: string;
  constructor(
    private suggestService: SuggestService
  ) { }

  hidePopup() {
    if (this.results) {
      this.isHide = true;
    }
  }

  doSearch() {
    this.suggestService.search(this.searchTerm$)
      .subscribe((searchResults: SuggestTerm[]) => {
        if (searchResults && searchResults.length > 0) {
          this.results = searchResults;
          this.isHide = false;
        } else {
          this.results = [];
        }
      });
  }

  ngOnInit() {
    this.doSearch();
  }
}


