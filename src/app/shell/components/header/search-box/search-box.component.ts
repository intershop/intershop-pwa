import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SearchBoxModel, SuggestedElement } from '../../../../models/search-box.model';
import { SuggestService } from '../../../../shared/services/suggest/suggest.service';

@Component({
  selector: 'is-search-box',
  templateUrl: './search-box.component.html'
})


export class SearchBoxComponent implements OnInit {

  results: SuggestedElement[];
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
      .subscribe((searchResults: SearchBoxModel) => {

        if (searchResults && searchResults.elements && searchResults.elements.length > 0) {
          this.results = searchResults.elements;
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


