import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'ish-filter-navigation-badges',
  templateUrl: './filter-navigation-badges.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationBadgesComponent implements OnChanges {
  @Input() filterNavigation: FilterNavigation;
  @Output() applyFilter = new EventEmitter<{ searchParameter: URLFormParams }>();
  @Output() clearFilters = new EventEmitter<void>();
  selected: { searchParameter: URLFormParams; displayName: string; filterName: string }[];

  ngOnChanges() {
    this.selected = this.filterNavigation?.filter?.reduce(
      (acc, filterElement) => [
        ...acc,
        ...filterElement.facets
          .filter(facet => facet.selected)
          .map(({ searchParameter, displayName }) => ({
            filterName: filterElement.name,
            displayName,
            searchParameter,
          })),
      ],
      []
    );
  }

  apply(searchParameter: URLFormParams) {
    this.applyFilter.emit({ searchParameter });
  }

  clear() {
    this.clearFilters.emit();
  }
}
