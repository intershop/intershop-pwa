import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

/**
 * The Filter Text Component displays a filter group. The facets of the filter group are presented as links with optional clear-button.
 *
 * @example
 * <ish-filter-text
 *               [filterElement]="element"
 *               (applyFilter)="applyFilter($event)"
 * </ish-filter-text>
 */
@Component({
  selector: 'ish-filter-text',
  templateUrl: './filter-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterTextComponent implements OnInit {
  @Input({ required: true }) filterElement: Filter;
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

  maxLevel = 0;
  facets: Facet[] = [];

  ngOnInit() {
    this.maxLevel = Math.max(...this.filterElement.facets.map(o => o.level)) || 0;

    this.facets = this.filterElement.facets.filter(x => x.selected || !this.maxLevel || x.level >= this.maxLevel);
  }

  filter(facet: Facet) {
    this.applyFilter.emit({ searchParameter: facet.searchParameter });
  }

  /**
   * sort selected to top, increase limitCount to selectedCount on showLess
   */
  getFacets() {
    const facets = [...this.facets];

    if (this.showAll || this.maxLevel >= 1 || this.filterElement.limitCount === -1) {
      return facets;
    }

    const selectedFacetsCount = facets.filter(x => x.selected).length;

    return facets
      .sort((a, b) => (a.selected > b.selected ? -1 : a.selected < b.selected ? 1 : 0))
      .slice(0, Math.max(this.filterElement.limitCount || 0, selectedFacetsCount));
  }

  get filterListElementId(): string {
    return `filter-list_${this.filterElement.name.replace(/\s+/g, '-')}`;
  }
}
