import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  @Input() fragmentOnRouting: string;
  @Input() orientation: 'sidebar' | 'horizontal' = 'sidebar';

  filter$ = this.store.pipe(select(getAvailableFilter));

  constructor(private store: Store<{}>, private router: Router, private activatedRoute: ActivatedRoute) {}

  applyFilter(event: { searchParameter: string }) {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      queryParams: { filters: b64u.decode(b64u.fromBase64(event.searchParameter)), page: 1 },
      fragment: this.fragmentOnRouting,
    });
  }

  get isSideBar() {
    return this.orientation === 'sidebar';
  }

  clearFilters() {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      queryParams: { filters: undefined, page: 1 },
      fragment: this.fragmentOnRouting,
    });
  }
}
