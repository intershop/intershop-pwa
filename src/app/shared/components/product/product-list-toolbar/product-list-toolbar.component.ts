import { ChangeDetectionStrategy, Component, OnChanges } from '@angular/core';

import { ProductListingContextFacade } from 'ish-core/facades/product-listing-context.facade';
import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';

@Component({
  selector: 'ish-product-list-toolbar',
  templateUrl: './product-list-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListToolbarComponent implements OnChanges {
  sortOptions: SelectOption[] = [];

  constructor(private context: ProductListingContextFacade) {}

  ngOnChanges() {
    this.sortOptions = this.mapSortableAttributesToSelectOptions(this.sortableAttributes);
  }

  private mapSortableAttributesToSelectOptions(sortableAttributes: SortableAttributesType[] = []): SelectOption[] {
    const options = sortableAttributes
      .filter(x => !!x)
      .map(sk => ({ value: sk.name, label: sk.displayName || sk.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
    options.unshift({ value: 'default', label: undefined });
    return options;
  }
}
