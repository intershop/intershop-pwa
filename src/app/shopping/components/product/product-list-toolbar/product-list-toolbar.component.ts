import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectOption } from '../../../../forms/shared/components/form-controls/select/select-option.interface';
import { ViewType } from '../../../../models/types';

@Component({
  selector: 'ish-product-list-toolbar',
  templateUrl: './product-list-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductListToolbarComponent implements OnInit, OnChanges {

  @Input() itemCount: number;
  @Input() viewType: ViewType = 'grid';
  @Input() sortBy = 'default';
  @Input() sortKeys: string[];
  @Output() viewTypeChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();

  sortForm: FormControl;
  sortOptions: SelectOption[] = [];

  ngOnInit() {
    this.sortForm = new FormControl(this.sortBy);
    this.sortForm.valueChanges.subscribe(this.sortByChange);
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.sortBy && this.sortForm) {
      this.sortForm.setValue(this.sortBy, { emitEvent: false });
    }

    if (c.sortKeys) {
      this.sortOptions = this.mapSortKeysToSelectOptions(this.sortKeys);
    }
  }

  // TODO: probably it's good to map this in a selector, not here
  private mapSortKeysToSelectOptions(sortKeys: string[]): SelectOption[] {
    return sortKeys.map(sk => ({ value: sk, label: sk }));
  }

  get listView() {
    return this.viewType === 'list';
  }

  get gridView() {
    return this.viewType === 'grid';
  }

  setViewType(mode: ViewType) {
    this.viewType = mode;
    this.viewTypeChange.emit(mode);
  }
}
