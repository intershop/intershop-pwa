import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import b64u from 'b64u';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';

@Component({
  selector: 'ish-filter-navigation',
  templateUrl: './filter-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationComponent implements OnInit {
  @Input() fragmentOnRouting: string;
  @Input() orientation: 'sidebar' | 'horizontal' = 'sidebar';

  filter$: Observable<FilterNavigation>;

  constructor(private shoppingFacade: ShoppingFacade, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.filter$ = this.shoppingFacade.currentFilter$;
  }

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
