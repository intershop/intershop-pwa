import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CategoryView } from '../../../../models/category-view/category-view.model';
import { getTopLevelCategories } from '../../../../shopping/store/categories';
import { CoreState } from '../../../store/core.state';

@Component({
  selector: 'ish-header-navigation-container',
  templateUrl: './header-navigation.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavigationContainerComponent implements OnInit {
  categories$: Observable<CategoryView[]>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.categories$ = this.store.pipe(select(getTopLevelCategories));
  }
}
