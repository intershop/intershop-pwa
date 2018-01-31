import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { filter } from 'rxjs/operators';
import { Category } from '../../../models/category/category.model';
import * as fromStore from '../../store';

@Component({
  selector: 'ish-category-page',
  templateUrl: './category-page.component.html'
})

export class CategoryPageComponent implements OnInit {

  category$: Observable<Category>;
  categoryPath$: Observable<Category[]> = of([]); // TODO: only category should be needed once the REST call returns the categoryPath as part of the category

  // TODO: these properties were copied from family-page.component and their relevance needs to be evaluated
  listView: Boolean;
  sortBy;
  totalItems: number;

  constructor(
    private store: Store<fromStore.ShoppingState>
  ) { }

  ngOnInit() {
    // TODO: find a nicer way to filter out the case of an 'undefined' category when the router state change is not waiting for the guard to actually do the routing
    this.category$ = this.store.select(fromStore.getSelectedCategory).pipe(
      filter(category => !!category)
    );

    // TODO: only category should be needed once the REST call returns the categoryPath as part of the category
    this.categoryPath$ = this.store.select(fromStore.getSelectedCategoryPath);
  }
}
