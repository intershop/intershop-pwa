import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';

@Component({
  selector: 'ish-filter-dropdown-multiselect',
  templateUrl: './filter-dropdown-multiselect.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./filter-dropdown-multiselect.component.scss'],
})
export class FilterDropdownMultiselectComponent implements OnInit {
  @Input() filterElement: Filter;
  @Input() placeholderType: 'groupName' | 'selectedFacets' = 'groupName';
  @Output() applyFilter: EventEmitter<{ searchParameter: string }> = new EventEmitter();

  placeholder = '';
  selectedFacets: Facet[] = [];

  apply(facet: Facet) {
    this.applyFilter.emit({ searchParameter: facet.searchParameter });
  }

  trackByFn(_, item: Facet) {
    return item.name;
  }

  ngOnInit() {
    this.initPlaceHolder();
  }

  initPlaceHolder() {
    this.placeholder = this.filterElement.name;

    this.selectedFacets = this.filterElement.facets.reduce((accumulator, x) => {
      if (x.selected) {
        accumulator.push(x);
      }
      return accumulator;
    }, []);

    if (this.placeholderType === 'selectedFacets') {
      const placeholder = this.selectedFacets.map(x => x.displayName).join(', ');

      if (placeholder) {
        this.placeholder = placeholder;
      }
    }
  }
}
