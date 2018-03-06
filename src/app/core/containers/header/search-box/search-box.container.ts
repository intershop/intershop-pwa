import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { SuggestTerm } from '../../../../models/suggest-term/suggest-term.model';
import { getSearchTerm } from '../../../../shopping/store/search';
import { ShoppingState } from '../../../../shopping/store/shopping.state';
import { SuggestService } from '../../../services/suggest/suggest.service';

@Component({
  selector: 'ish-search-box-container',
  templateUrl: './search-box.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxContainerComponent implements OnInit {

  searchResults$: Observable<SuggestTerm[]>;
  previousSearchTerm$: Observable<string>;

  private searchTerm$ = new Subject<string>();

  constructor(
    private suggestService: SuggestService,
    private store: Store<ShoppingState>,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchResults$ = this.suggestService.search(this.searchTerm$);
    this.previousSearchTerm$ = this.store.pipe(
      select(getSearchTerm),
      filter(x => !!x)
    );
  }

  search(term: string) {
    this.searchTerm$.next(term);
  }

  performSearch(searchTerm: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'SearchTerm': searchTerm }
    };

    this.router.navigate(['/search'], navigationExtras);
  }
}
