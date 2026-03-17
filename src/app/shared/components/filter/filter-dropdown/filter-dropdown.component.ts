import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

/**
 * The Filter Dropdown Component displays a filter group. The items of the filter group are presented as a dropdown menu.
 *
 * @example
 * <ish-filter-dropdown
 *   placeholderType="selectedFacets"
 *   [filterElement]="element"
 *   (applyFilter)="applyFilter($event)" />
 */
@Component({
  selector: 'ish-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./filter-dropdown.component.scss'],
  standalone: true,
  imports: [ NgClass],
})
export class FilterDropdownComponent implements OnInit {
  @Input({ required: true }) filterElement: Filter;
  @Input() placeholderType: 'groupName' | 'selectedFacets' = 'groupName';
  @Output() readonly applyFilter = new EventEmitter<{ searchParameter: URLFormParams }>();

  placeholder = '';

  apply(facet: Facet) {
    this.applyFilter.emit({ searchParameter: facet.searchParameter });
  }

  ngOnInit() {
    this.initPlaceHolder();
  }

  private initPlaceHolder() {
    this.placeholder = this.filterElement.name;

    const selectedFacets = this.filterElement.facets.filter(x => x.selected);

    if (this.placeholderType === 'selectedFacets') {
      const placeholder = selectedFacets.map(x => x.displayName).join(', ');

      if (placeholder) {
        this.placeholder = placeholder;
      }
    }
  }
}
