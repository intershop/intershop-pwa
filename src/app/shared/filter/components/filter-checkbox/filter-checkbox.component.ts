import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';

/**
 * The Filter Checkbox Component displays a filter group. The items of the filter group are presented as checkboxes.
 *
 * @example
 * <ish-filter-checkbox
 *               [filterElement]="element"
 *               (applyFilter)="applyFilter($event)"
 *               (removeFilter)="removeFilter($event)"
 * </ish-filter-checkbox>
 */
@Component({
  selector: 'ish-filter-checkbox',
  templateUrl: './filter-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterCheckboxComponent implements OnInit {
  @Input() filterElement: Filter;
  @Output() applyFilter: EventEmitter<{ searchParameter: string }> = new EventEmitter();
  @Output() removeFilter: EventEmitter<{ searchParameter: string }> = new EventEmitter();

  ngOnInit() {
    // # console.log('### this.filterElement (facetGroup)', this.filterElement);
    // todo in mapper!? filter-navigation.mapper.ts
    this.filterElement.facets = this.filterElement.facets.sort((a, b) => {
      if (a.selected && !b.selected) {
        return -1;
      } else if (!a.selected && b.selected) {
        return 1;
      } else if (!a.selected && !b.selected) {
        return a.level > b.level ? -1 : a.level < b.level ? 1 : a.count > b.count ? -1 : a.count < b.count ? 1 : 0;
      } else {
        return 0;
      }
    });
  }

  filter(facet: Facet) {
    // # console.log('### filter', facet);
    this.applyFilter.emit({ searchParameter: facet.searchParameter });
  }

  removeFacet(facet: Facet) {
    // # console.log(facet);
    this.removeFilter.emit({ searchParameter: facet.searchParameter });
  }
}
