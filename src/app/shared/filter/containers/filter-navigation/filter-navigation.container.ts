import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import b64u from 'b64u';

import { getAvailableFilter } from 'ish-core/store/shopping/filter';

@Component({
  selector: 'ish-filter-navigation',
  templateUrl: './filter-navigation.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationContainerComponent {
  filter$ = this.store.pipe(select(getAvailableFilter));

  constructor(private store: Store<{}>, private router: Router, private activatedRoute: ActivatedRoute) {}

  applyFilter(event: { filterId: string; searchParameter: string }) {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      queryParams: { filters: b64u.decode(b64u.fromBase64(event.searchParameter)) },
    });
  }
}
