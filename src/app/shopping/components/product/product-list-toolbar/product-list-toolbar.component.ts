import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SelectOption } from '../../../../forms/shared/components/form-controls/select/select-option.interface';
import { ViewType } from '../../../../models/viewtype/viewtype.types';

@Component({
  selector: 'ish-product-list-toolbar',
  templateUrl: './product-list-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListToolbarComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  itemCount: number;
  @Input()
  viewType: ViewType = 'grid';
  @Input()
  sortBy = 'default';
  @Input()
  sortKeys: string[];
  @Output()
  viewTypeChange = new EventEmitter<string>();
  @Output()
  sortByChange = new EventEmitter<string>();

  destroy$ = new Subject();
  sortForm: FormGroup;
  sortOptions: SelectOption[] = [];

  ngOnInit() {
    this.sortForm = new FormGroup({
      sortDropdown: new FormControl(''),
    });
    this.sortForm
      .get('sortDropdown')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(this.sortByChange);
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.sortBy && this.sortForm) {
      this.sortForm.get('sortDropdown').setValue(this.sortBy, { emitEvent: false });
    }

    if (c.sortKeys) {
      this.sortOptions = this.mapSortKeysToSelectOptions(this.sortKeys);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
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
    this.viewTypeChange.emit(mode);
  }
}
