import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Facet } from '../../../../models/facet/facet.model';
import { Filter } from '../../../../models/filter/filter.model';

@Component({
  selector: 'ish-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDropdownComponent implements OnInit {
  @Input() filterElement: Filter;
  @Output() applyFilter: EventEmitter<{ filterId: string; searchParameter: string }> = new EventEmitter();
  hasSelected: boolean;
  getFilterName = url => url.split('/filters/')[1].split(';')[0];
  getQueryParam = url => url.split(';SearchParameter=')[1];
  ngOnInit() {
    const facet: Facet[] = this.filterElement.facets;
    this.hasSelected = !!facet.find(e => e.selected);
  }
  filter(filterId, searchParameter) {
    this.applyFilter.emit({ filterId, searchParameter });
  }
}
