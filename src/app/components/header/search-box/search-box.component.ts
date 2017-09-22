import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SuggestedElement, SearchBoxModel } from '../../../services/suggest/search-box.model';
import { SearchBoxService } from '../../../services/suggest/search-box.service';

@Component({
  selector: 'is-search-box',
  templateUrl: './search-box.component.html'
})


export class SearchBoxComponent implements OnInit {

  results: SuggestedElement[];
  searchTerm$ = new Subject<string>();
  isHide = false;
  searchButtonText: string;
  constructor(private searchBoxService: SearchBoxService) {
  }

  hidePopup() {
    if (this.results) {
      this.isHide = true;
    }
  }

  doSearch() {
    this.searchBoxService.search(this.searchTerm$)
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


