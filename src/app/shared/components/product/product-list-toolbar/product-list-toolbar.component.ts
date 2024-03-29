import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-product-list-toolbar',
  templateUrl: './product-list-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListToolbarComponent implements OnChanges {
  @Input({ required: true }) sortableAttributes: SortableAttributesType[];
  @Input() itemCount: number;
  @Input() viewType: ViewType = 'grid';
  @Input() sortBy = 'default';
  @Input() currentPage: number;
  @Input() pageIndices: { value: number; display: string }[];
  @Input() fragmentOnRouting: string;
  @Input() isPaging = false;

  sortOptions: SelectOption[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnChanges() {
    this.sortOptions = this.mapSortableAttributesToSelectOptions(this.sortableAttributes);
  }

  changeSortBy(target: EventTarget) {
    const sorting = (target as HTMLDataElement).value;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'merge',
      queryParams: this.isPaging ? { sorting, page: 1 } : { sorting },
      fragment: this.fragmentOnRouting,
    });
  }

  private mapSortableAttributesToSelectOptions(sortableAttributes: SortableAttributesType[] = []): SelectOption[] {
    return sortableAttributes
      .filter(x => !!x)
      .map(sk => ({ value: sk.name, label: sk.displayName || sk.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  get listView() {
    return this.viewType === 'list';
  }

  get gridView() {
    return !this.listView;
  }
}
