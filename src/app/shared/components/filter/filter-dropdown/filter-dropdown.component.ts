import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

/**
 * The Filter Dropdown Component displays a filter group. The items of the filter group are presented as a dropdown menu.
 *
 * @example
 * <ish-filter-dropdown
 *   [filterElement]="element"
 *   (applyFilter)="applyFilter($event)" />
 */
@Component({
  selector: 'ish-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDropdownComponent implements OnChanges {
  @Input({ required: true }) filterElement!: Filter;
  @Output() readonly applyFilter = new EventEmitter<{ searchParameter: URLFormParams }>();

  selectedFacetsControl = new FormControl<Facet | Facet[]>([], { nonNullable: true });
  placeholder = '';
  isMultiSelect = true;

  ngOnChanges() {
    this.isMultiSelect = this.filterElement.selectionType !== 'single';
    this.placeholder = this.filterElement.name;

    const selectedFacets = this.filterElement.facets.filter(x => x.selected);
    this.selectedFacetsControl.setValue(this.isMultiSelect ? selectedFacets : (selectedFacets[0] ?? undefined), {
      emitEvent: false,
    });
  }

  apply(facet: Facet) {
    this.applyFilter.emit({ searchParameter: facet.searchParameter });
  }

  onSingleChange(facet: Facet) {
    if (!this.isMultiSelect) {
      const target = facet ?? this.filterElement.facets.find(f => f.selected);
      if (target) {
        this.apply(target);
      }
    }
  }
}
