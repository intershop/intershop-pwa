import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'ish-filter-navigation-actions',
  templateUrl: './filter-navigation-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationActionsComponent implements OnChanges {
  @Input({ required: true }) filterNavigation: FilterNavigation;
  @Output() readonly clearFilters = new EventEmitter<void>();
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

  clear() {
    this.clearFilters.emit();
  }
}
