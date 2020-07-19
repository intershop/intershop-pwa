import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

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
export class FilterSwatchImagesComponent {
  /**
   * The filter group.
   */
  @Input() filterElement: Filter;
  @Output() applyFilter: EventEmitter<{ searchParameter: URLFormParams }> = new EventEmitter();

  /**
   * Applies a facet of the filter group and shows the new filtered result.
   */
  filter(facet: Facet) {
    this.applyFilter.emit({ searchParameter: facet.searchParameter });
  }

  getBackgroundColor(facet: Facet) {
    return facet.mappedType === 'colorcode' ? facet.mappedValue : undefined;
  }

  getBackgroundImage(facet: Facet) {
    return facet.mappedType === 'image' ? facet.mappedValue : undefined;
  }
}
