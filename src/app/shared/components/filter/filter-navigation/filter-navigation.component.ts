import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { URLFormParams, formParamsToString } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'ish-filter-navigation',
  templateUrl: './filter-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationComponent implements OnInit {
  @Input() fragmentOnRouting: string;
  @Input() orientation: 'sidebar' | 'horizontal' = 'sidebar';
  @Input() showCategoryFilter = true;

  filter$: Observable<FilterNavigation>;

  constructor(private shoppingFacade: ShoppingFacade, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.filter$ = this.shoppingFacade.currentFilter$(this.showCategoryFilter);
  }

  applyFilter(event: { searchParameter: URLFormParams }) {
    const params = formParamsToString(event.searchParameter);
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      queryParams: { filters: params, page: 1 },
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
