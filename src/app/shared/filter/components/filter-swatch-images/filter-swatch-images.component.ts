import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class FilterSwatchImagesComponent implements OnInit {
  /**
   * The filter group.
   */
  @Input() filterElement: Filter;
  @Output() applyFilter: EventEmitter<{ searchParameter: string }> = new EventEmitter();

  filterForm: FormGroup;

  private destroy$ = new Subject();

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
  filter(facet: Facet) {
    this.applyFilter.emit({ searchParameter: facet.searchParameter });
  }
}
