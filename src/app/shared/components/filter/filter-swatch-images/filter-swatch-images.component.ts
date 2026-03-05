import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { SanitizePipe } from 'ish-core/pipes/sanitize.pipe';
import { URLFormParams } from 'ish-core/utils/url-form-params';

/**
 * The Filter Swatch Images Component displays filter group for colors. The facets of the filter group are presented as swatch images.
 *
 * @example
 * <ish-filter-dropdown
 *   [filterElement]="element"
 *   (applyFilter)="applyFilter($event)" />
 */
@Component({
  selector: 'ish-filter-swatch-images',
  templateUrl: './filter-swatch-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, NgFor, TranslateModule, SanitizePipe],
})
export class FilterSwatchImagesComponent {
  /**
   * The filter group.
   */
  @Input({ required: true }) filterElement: Filter;
  @Output() readonly applyFilter = new EventEmitter<{ searchParameter: URLFormParams }>();

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
