import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Category } from '../../../../models/category/category.model';
import { getTopLevelCategories, LoadTopLevelCategories } from '../../../../shopping/store/categories';
import { CoreState } from '../../../store/core.state';
import { getCurrentLocale } from '../../../store/locale';

@Component({
  selector: 'ish-header-navigation-container',
  templateUrl: './header-navigation.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavigationContainerComponent implements OnInit {

  @Input() maxSubCategoriesDepth = 0;

  categories$: Observable<Category[]>;

  constructor(
    private store: Store<CoreState>,
  ) { }

  ngOnInit() {
    this.categories$ = this.store.pipe(select(getTopLevelCategories));

    // TODO: this could be an effect if maxSubCategoriesDepth would be defined as a global property
    this.store.pipe(select(getCurrentLocale)).subscribe(() =>
      this.store.dispatch(new LoadTopLevelCategories(this.maxSubCategoriesDepth))
    );
  }
}
