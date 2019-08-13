import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';

@Component({
  selector: 'ish-filter-dropdown-multiselect',
  templateUrl: './filter-dropdown-multiselect.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./filter-dropdown-multiselect.component.scss'],
})
export class FilterDropdownMultiselectComponent {
  @Input() filterElement: Filter;
  @Output() applyFilter: EventEmitter<{ filterId: string; searchParameter: string }> = new EventEmitter();

  apply(facet: Facet) {
    this.applyFilter.emit({ filterId: facet.filterId, searchParameter: facet.searchParameter });
  }

  trackByFn(_, item: Facet) {
    return item.name;
  }
}
