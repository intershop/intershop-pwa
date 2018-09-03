import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import { ApplyFilter, getAvailableFilter } from '../../store/filter';

@Component({
  selector: 'ish-filter-navigation',
  templateUrl: './filter-navigation.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationContainerComponent implements OnInit {
  filter$: Observable<FilterNavigation>;
  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.filter$ = this.store.pipe(select(getAvailableFilter));
  }

  applyFilter(event: { filterId: string; searchParameter: string }) {
    this.store.dispatch(new ApplyFilter(event));
  }
}
