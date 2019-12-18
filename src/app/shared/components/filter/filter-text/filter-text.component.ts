import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';

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
  @Input() filterElement: Filter;
  @Output() applyFilter: EventEmitter<{ searchParameter: string }> = new EventEmitter();

  maxLevel = 0;
  facets: Facet[] = [];

  ngOnInit() {
    this.maxLevel = Math.max.apply(Math, this.filterElement.facets.map(o => o.level)) || 0;
    this.facets = this.filterElement.facets.filter(x => x.selected || !this.maxLevel || x.level >= this.maxLevel);
  }

  filter(facet: Facet) {
    this.applyFilter.emit({ searchParameter: facet.searchParameter });
  }
}
