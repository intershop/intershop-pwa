import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ViewMode } from '../../../../models/types';
import { SelectOption } from '../../../../shared/components/form-controls/select/select-option.interface';

@Component({
  selector: 'ish-product-list-filter',
  templateUrl: './product-list-filter.component.html'
})

export class ProductListFilterComponent implements OnInit, OnChanges {

  @Input() itemCount: number;
  @Input() sortBy: string;
  @Input() viewMode: ViewMode = 'list';
  @Output() sortByChange = new EventEmitter<string>();
  @Output() viewModeChange = new EventEmitter<string>();

  sortForm: FormControl;

  sortOptions: SelectOption[] = [
    { value: 'default', label: 'Default Sorting' },
    { value: 'name-asc', label: 'Name asc' },
    { value: 'name-desc', label: 'Name desc' },
    { value: 'SalesRankUnitsIndex-desc', label: 'Topsellers' },
    { value: 'ArrivalDate-desc', label: 'Newest Arrivals' },
  ];

  itemCountPluralMapping = {
    '=0': 'No Items',
    '=1': '1 List Item',
    'other': '# List Items'
  };


  ngOnInit() {
    this.sortForm = new FormControl(this.sortBy);
    this.sortForm.valueChanges.subscribe(this.sortByChange);
  }


  ngOnChanges(c: SimpleChanges) {
    if (c.sortBy && this.sortForm) {
      this.sortForm.setValue(this.sortBy, { emitEvent: false });
    }
  }

  get listView() {
    return this.viewMode === 'list';
  }

  get gridView() {
    return this.viewMode === 'grid';
  }

  setViewMode(mode: ViewMode) {
    this.viewMode = mode;
    this.viewModeChange.emit(mode);
  }
}
