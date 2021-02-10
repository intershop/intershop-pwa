import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

/**
 * The Product List Component displays a list of products.
 *
 * @example
 * <ish-product-list
 *               [products]="products$ | async"
 *               [categoryId]="selectedCategoryId$ | async"
 *               [viewType]="viewType$ | async"
 * ></ish-product-list>
 */
@Component({
  selector: 'ish-product-list',
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  @Input() products: string[];
  @Input() categoryId?: string;
  @Input() viewType?: ViewType = 'grid';

  listingLoading$: Observable<boolean>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit(): void {
    this.listingLoading$ = this.shoppingFacade.productListingLoading$;
  }

  get isList() {
    return this.viewType === 'list';
  }

  get isGrid() {
    return !this.isList;
  }
}
