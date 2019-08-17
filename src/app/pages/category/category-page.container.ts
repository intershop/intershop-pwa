import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';

import { getCategoryLoading, getSelectedCategory } from 'ish-core/store/shopping/categories';
import { getDeviceType } from 'ish-core/store/viewconf';

@Component({
  selector: 'ish-category-page-container',
  templateUrl: './category-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageContainerComponent {
  category$ = this.store.pipe(select(getSelectedCategory));
  categoryLoading$ = this.store.pipe(
    select(getCategoryLoading),
    debounceTime(500)
  );
  deviceType$ = this.store.pipe(select(getDeviceType));

  constructor(private store: Store<{}>) {}
}
