import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Filter } from '../../../../models/filter/filter.model';

/**
 * The Filter Dropdown Component displays a filter group. The facets of the filter group are presented as options of a select box.
 *
 * @example
 * <ish-filter-dropdown
 *               [filterElement]="element"
 *               (applyFilter)="applyFilter($event)"
 * </ish-filter-dropdown>
 */
@Component({
  selector: 'ish-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDropdownComponent implements OnInit {
  /**
   * The filter group.
   */
  @Input()
  filterElement: Filter;
  @Output()
  applyFilter: EventEmitter<{ filterId: string; searchParameter: string }> = new EventEmitter();
  destroy$ = new Subject();
  filterForm: FormGroup;
  isCollapsed = false;

  ngOnInit() {
    this.filterForm = new FormGroup({
      filterDropdown: new FormControl(''),
    });

    this.filterForm
      .get('filterDropdown')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(filterDropdown => this.filter(filterDropdown));
  }

  /**
   * Applies a facet of the filter group and shows the new filtered result.
   */
  filter(facetName: string) {
    const facet = this.filterElement.facets.find(f => f.name === facetName);
    this.applyFilter.emit({ filterId: facet.filterId, searchParameter: facet.searchParameter });
  }
}
