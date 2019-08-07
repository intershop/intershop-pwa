import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { SelectOption } from '../../../forms/components/select/select.component';

@Component({
  selector: 'ish-product-list-toolbar',
  templateUrl: './product-list-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListToolbarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() itemCount: number;
  @Input() viewType: ViewType = 'grid';
  @Input() sortBy = 'default';
  @Input() sortKeys: string[];
  @Input() currentPage: number;
  @Input() pageIndices: number[];
  @Input() fragmentOnRouting: string;

  sortForm = new FormGroup({
    sortDropdown: new FormControl(''),
  });
  sortOptions: SelectOption[] = [];

  private destroy$ = new Subject();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.sortForm
      .get('sortDropdown')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(sorting => {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParamsHandling: 'merge',
          queryParams: { sorting, page: 1 },
          fragment: this.fragmentOnRouting,
        });
      });
  }

  ngOnChanges(c: SimpleChanges) {
    this.updateSortBy(c.sortBy);
    this.updateSortKeys(c.sortKeys);
  }

  private updateSortBy(sortBy: SimpleChange) {
    if (sortBy && this.sortForm) {
      this.sortForm.get('sortDropdown').setValue(this.sortBy, { emitEvent: false });
    }
  }

  private updateSortKeys(sortKeys: SimpleChange) {
    if (sortKeys) {
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
    return !this.listView;
  }
}
