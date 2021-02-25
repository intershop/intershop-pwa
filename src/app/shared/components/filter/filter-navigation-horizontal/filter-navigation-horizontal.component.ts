import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'ish-filter-navigation-horizontal',
  templateUrl: './filter-navigation-horizontal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationHorizontalComponent {
  @Input() filterNavigation: FilterNavigation;
  @Output() applyFilter = new EventEmitter<{ searchParameter: URLFormParams }>();

  trackByFn(_: number, item: Filter) {
    return item.id;
  }
}
