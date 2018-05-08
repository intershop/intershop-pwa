import { Component, OnInit } from '@angular/core';
import { LoadFilterForCategory, ApplyFilter } from './../../store/filter/filter.actions';
import { FilterState } from './../../store/filter/filter.reducer';
import { FilterNavigation } from './../../../models/filter-navigation/filter-navigation.model';
import { Category } from './../../../models/category/category.model';
import { FilterService } from './../../services/filter/filter.service';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store/filter';

@Component({
  selector: 'ish-filter-navigation',
  templateUrl: './filter-navigation.component.html',
  styleUrls: ['./filter-navigation.component.css'],
})
export class FilterNavigationComponent implements OnInit {
  filter$: Observable<FilterNavigation>;
  constructor(private store: Store<FilterState>) {}

  ngOnInit() {
    this.filter$ = this.store.pipe(select(fromStore.getAvailableFilter));
  }

  applyFilter(e) {
    this.store.dispatch(new ApplyFilter(e));
  }
}
