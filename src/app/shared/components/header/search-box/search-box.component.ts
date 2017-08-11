import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SuggestedElement, SearchBoxModel } from './search-box-service/search-box.model';
import { SearchBoxService } from './search-box-service/search-box.service';

@Component({
  selector: 'is-searchbox',
  templateUrl: './search-box.component.html'
})


export class SearchBoxComponent implements OnInit {

  public model: any;
  results: SuggestedElement[];
  searchTerm$ = new Subject<string>();
  isHide = false;

  constructor(private searchBoxService: SearchBoxService) {
  }

  hidePopuep() {
    if (this.results) {
      this.isHide = true;
    }
  }

  ngOnInit() {
    this.searchBoxService.search(this.searchTerm$)
      .subscribe((results: SearchBoxModel) => {

        if (results && results.elements.length > 0) {
          this.results = results.elements;
          this.isHide = false;
        } else {
          this.results = [];
        }
      });
  }
};


