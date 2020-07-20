import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

/**
 * The Filter Checkbox Component displays a filter group. The items of the filter group are presented as checkboxes.
 *
 * @example
 * <ish-filter-checkbox
 *               [filterElement]="element"
 *               (applyFilter)="applyFilter($event)"
 * </ish-filter-checkbox>
 */
@Component({
  selector: 'ish-filter-checkbox',
  templateUrl: './filter-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterCheckboxComponent {
  @Input() filterElement: Filter;
  @Output() applyFilter: EventEmitter<{ searchParameter: URLFormParams }> = new EventEmitter();

  /**
   * two-way-binding (banana in a box) [(showAll)]="showAllElements[element.name]"
   */
  @Output()
  showAllChange = new EventEmitter<boolean>();
  private showAllValue = false;
  @Input()
  get showAll() {
    return this.showAllValue;
  }
  set showAll(val) {
    this.showAllValue = val;
    this.showAllChange.emit(this.showAllValue);
  }

  filter(facet: Facet) {
    this.applyFilter.emit({ searchParameter: facet.searchParameter });
  }

  /**
   * sort selected to top, increase limitCount to selectedCount on showLess
   */
  getFacets() {
    const facets = [...this.filterElement.facets];

    const selectedFacetsCount = facets.filter(x => x.selected).length;

    return this.showAll || this.filterElement.limitCount === -1
      ? facets
      : facets
          .sort((a, b) => (a.selected > b.selected ? -1 : a.selected < b.selected ? 1 : 0))
          .slice(0, Math.max(this.filterElement.limitCount || 0, selectedFacetsCount));
  }
}
