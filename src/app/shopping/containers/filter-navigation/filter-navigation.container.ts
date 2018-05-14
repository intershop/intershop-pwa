import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import * as fromStore from '../../store/filter';
import { ApplyFilter } from '../../store/filter/filter.actions';
import { FilterState } from '../../store/filter/filter.reducer';

@Component({
  selector: 'ish-filter-navigation',
  templateUrl: './filter-navigation.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationContainerComponent implements OnInit {
  filter$: Observable<FilterNavigation>;
  constructor(private store: Store<FilterState>) {}

  ngOnInit() {
    this.filter$ = this.store.pipe(select(fromStore.getAvailableFilter));
  }

  applyFilter(e) {
    this.store.dispatch(new ApplyFilter(e));
  }
}
