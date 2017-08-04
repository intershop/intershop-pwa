import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SuggestedElement } from './searchBoxService/searchBox.model';
import { SearchBoxService } from './searchBoxService/searchBox.service';

@Component({
  selector: 'is-searchbox',
  templateUrl: './searchBox.component.html'
})


export class SearchBoxComponent implements OnInit {

  public model: any;
  results: SuggestedElement[];
  searchTerm$ = new Subject<string>();
  isHide = false;

  constructor() {
  }

  hidePopuep() {
    if (this.results) {
      this.isHide = true;
    }
  }

  ngOnInit() {
    SearchBoxService.search(this.searchTerm$)
      .subscribe((results: SuggestedElement[]) => {

        if (results.length > 0) {
          this.results = results;
          this.isHide = false;
        } else {
          this.results = [];
        }
        // this.results = results.length > 0 ? results : [];
      });
  }
};


