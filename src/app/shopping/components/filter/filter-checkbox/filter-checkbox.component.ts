import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Facet } from '../../../../models/facet/facet.model';
import { Filter } from '../../../../models/filter/filter.model';

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
  @Input()
  filterElement: Filter;
  @Output()
  applyFilter: EventEmitter<{ filterId: string; searchParameter: string }> = new EventEmitter();
  isCollapsed = false;

  filter(facet: Facet) {
    this.applyFilter.emit({ filterId: facet.filterId, searchParameter: facet.searchParameter });
  }
}
