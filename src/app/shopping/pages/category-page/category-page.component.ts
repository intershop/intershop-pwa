import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Category } from '../../../models/category/category.model';
import * as fromStore from '../../store';

@Component({
  selector: 'ish-category-page',
  templateUrl: './category-page.component.html'
})

export class CategoryPageComponent implements OnInit {

  category$: Observable<Category>;
  categoryPath: Category[] = []; // TODO: only category should be needed once the REST call returns the categoryPath as part of the category

  // TODO: these properties were copied from family-page.component and their relevance needs to be evaluated
  listView: Boolean;
  sortBy;
  totalItems: number;

  constructor(
    private store: Store<fromStore.ShoppingState>
  ) { }

  ngOnInit() {
    this.category$ = this.store.select(fromStore.getCategory);

    // this.route.data
    //   .map(data => data.categoryId)
    //   .map(id => new fromStore.LoadCategory(id))
    //   .subscribe(this.store);


    // this.route.params.subscribe(params => {
    // TODO: use this.route.snapshot.url instead of internal this.route.snapshot['_routerState'].url
    // this.categoriesService.getCategory(this.route.snapshot['_routerState'].url.split('/category/')[1]).subscribe((category: Category) => {
    // });
    // TODO: only category should be needed once the REST call returns the categoryPath as part of the category
    // this.route.data.map(data => data.categoryPath).subscribe((categoryPath: Category[]) => {
    //   this.categoryPath = categoryPath;
    // });
  }
}
