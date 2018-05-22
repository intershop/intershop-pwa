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

  ngOnInit() {
    const facet: Facet[] = this.filterElement.facets;
    this.hasSelected = !!facet.find(e => e.selected);
  }
  filter(facet: Facet) {
    this.applyFilter.emit({ filterId: facet.filterId, searchParameter: facet.searchParameter });
  }
}
