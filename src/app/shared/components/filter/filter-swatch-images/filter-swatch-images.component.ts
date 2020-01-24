import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';

/**
 * The Filter Swatch Images Component displays filter group for colors. The facets of the filter group are presented as swatch images.
 *
 * @example
 * <ish-filter-dropdown
 *               [filterElement]="element"
 *               (applyFilter)="applyFilter($event)"
 * </ish-filter-dropdown>
 */
@Component({
  selector: 'ish-filter-swatch-images',
  templateUrl: './filter-swatch-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:ccp-no-intelligence-in-components
export class FilterSwatchImagesComponent {
  /**
   * The filter group.
   */
  @Input() filterElement: Filter;
  @Output() applyFilter: EventEmitter<{ searchParameter: string }> = new EventEmitter();

  /**
   * Applies a facet of the filter group and shows the new filtered result.
   */
  filter(facet: Facet) {
    this.applyFilter.emit({ searchParameter: facet.searchParameter });
  }

  getBackgroundColor(facet: Facet) {
    return this.filterElement.filterValueMap[facet.displayName] &&
      this.filterElement.filterValueMap[facet.displayName].type
      ? this.filterElement.filterValueMap[facet.displayName].type === 'colorcode'
        ? this.filterElement.filterValueMap[facet.displayName].mapping
        : undefined
      : facet.displayName.toLowerCase();
  }

  getBackgroundImage(facet: Facet) {
    return this.filterElement.filterValueMap[facet.displayName] &&
      this.filterElement.filterValueMap[facet.displayName].type === 'image'
      ? this.filterElement.filterValueMap[facet.displayName].mapping
      : undefined;
  }
}
