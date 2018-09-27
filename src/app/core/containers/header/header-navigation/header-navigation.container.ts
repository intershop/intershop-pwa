import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getTopLevelCategories } from '../../../../shopping/store/categories';

@Component({
  selector: 'ish-header-navigation-container',
  templateUrl: './header-navigation.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavigationContainerComponent {
  @Input()
  view: 'auto' | 'small' | 'full' = 'auto';

  categories$ = this.store.pipe(select(getTopLevelCategories));

  constructor(private store: Store<{}>) {}
}
