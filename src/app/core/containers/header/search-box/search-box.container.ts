import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SuggestTerm } from '../../../../models/suggest-term/suggest-term.model';
import { DoSuggestSearch, getSearchTerm, getSuggestSearchResults } from '../../../../shopping/store/search';
import { ShoppingState } from '../../../../shopping/store/shopping.state';

@Component({
  selector: 'ish-search-box-container',
  templateUrl: './search-box.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxContainerComponent implements OnInit {

  searchResults$: Observable<SuggestTerm[]>;
  previousSearchTerm$: Observable<string>;

  constructor(
    private store: Store<ShoppingState>,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchResults$ = this.store.pipe(select(getSuggestSearchResults));
    this.previousSearchTerm$ = this.store.pipe(select(getSearchTerm));
  }

  suggestSearch(term: string) {
    this.store.dispatch(new DoSuggestSearch(term));
  }

  performSearch(searchTerm: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'SearchTerm': searchTerm }
    };
    this.router.navigate(['/search'], navigationExtras);
  }
}
