import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';

@Component({
  selector: 'ish-filter-navigation-horizontal',
  templateUrl: './filter-navigation-horizontal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationHorizontalComponent {
  @Input() filterNavigation: FilterNavigation;
  @Output() applyFilter = new EventEmitter<{ searchParameter: string }>();

  trackByFn(_, item: Filter) {
    return item.id;
  }
}
