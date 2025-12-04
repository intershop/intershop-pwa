import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

/**
 * The Product List Component displays a list of products.
 *
 * @example
 * <ish-product-list
 *               [categoryId]="selectedCategoryId$ | async"
 *               [products]="products$ | async"
 *               [viewType]="viewType$ | async"
 * />
 */
@Component({
  selector: 'ish-product-list',
  imports: [AsyncPipe, LoadingComponent, ProductContextDirective, ProductItemComponent, TranslatePipe],
  standalone: true,
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  @Input({ required: true }) products: string[];
  @Input() categoryId: string;
  @Input() viewType: ViewType = 'grid';

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
