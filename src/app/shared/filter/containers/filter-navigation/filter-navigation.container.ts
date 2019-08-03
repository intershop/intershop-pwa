import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import b64u from 'b64u';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { ApplyFilter, getAvailableFilter } from 'ish-core/store/shopping/filter';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-filter-navigation',
  templateUrl: './filter-navigation.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationContainerComponent implements OnInit, OnDestroy {
  filter$ = this.store.pipe(select(getAvailableFilter));

  private destroy$ = new Subject();

  constructor(private store: Store<{}>, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnDestroy() {
    this.destroy$.next();
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .pipe(
        map(params => params.get('filters')),
        distinctUntilChanged(),
        whenTruthy(),
        takeUntil(this.destroy$)
      )
      .subscribe(filters =>
        this.store.dispatch(
          new ApplyFilter({ filterId: 'default', searchParameter: b64u.toBase64(b64u.encode(filters)) })
        )
      );
  }

  applyFilter(event: { filterId: string; searchParameter: string }) {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      queryParams: { filters: b64u.decode(b64u.fromBase64(event.searchParameter)) },
    });
  }
}
