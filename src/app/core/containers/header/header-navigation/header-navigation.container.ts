import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CategoryView } from '../../../../models/category-view/category-view.model';
import { getTopLevelCategories } from '../../../../shopping/store/categories';

@Component({
  selector: 'ish-header-navigation-container',
  templateUrl: './header-navigation.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavigationContainerComponent implements OnInit {
  @Input()
  view: 'auto' | 'small' | 'full' = 'auto';

  categories$: Observable<CategoryView[]>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.categories$ = this.store.pipe(select(getTopLevelCategories));
  }
}
