import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Facet } from '../../../../models/facet/facet.model';
import { Filter } from '../../../../models/filter/filter.model';

@Component({
  selector: 'ish-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDropdownComponent implements OnInit {
  @Input() filterElement: Filter;
  hasSelected: boolean;

  ngOnInit() {
    const facet: Facet[] = this.filterElement.facets;
    this.hasSelected = !!facet.find(e => e.selected);
  }
}
