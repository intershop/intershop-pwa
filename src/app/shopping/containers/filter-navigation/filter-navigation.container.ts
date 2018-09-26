import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ApplyFilter, getAvailableFilter } from '../../store/filter';

@Component({
  selector: 'ish-filter-navigation',
  templateUrl: './filter-navigation.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationContainerComponent {
  filter$ = this.store.pipe(select(getAvailableFilter));
  constructor(private store: Store<{}>) {}

  applyFilter(event: { filterId: string; searchParameter: string }) {
    this.store.dispatch(new ApplyFilter(event));
  }
}
