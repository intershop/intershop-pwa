import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { isEqual } from 'lodash-es';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductContextDisplayProperties } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import {
  ProductItemComponent,
  ProductItemDisplayType,
} from 'ish-shared/components/product/product-item/product-item.component';

import { ProductsListCarouselComponent } from './products-list-carousel/products-list-carousel.component';

@Component({
  selector: 'ish-products-list',
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgFor,
    ProductItemComponent,
    NgClass,
    ProductContextDirective,
    ProductsListCarouselComponent,
  ],
})
export class ProductsListComponent implements OnChanges {
  @Input({ required: true }) productSKUs: string[];
  @Input() listStyle: string;
  @Input() slideItems: number;
  @Input() listItemStyle: ProductItemDisplayType;
  @Input() listItemCSSClass: string;
  @Input() listItemConfiguration: Partial<ProductContextDisplayProperties>;

  productSKUs$: Observable<string[]>;
  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnChanges(): void {
    // remove all SKUs from the productSKUs Array that are also contained in the failed products Array
    this.productSKUs$ = combineLatest([of(this.productSKUs), this.shoppingFacade.failedProducts$]).pipe(
      distinctUntilChanged<[string[], string[]]>(isEqual),
      map(([skus, failed]) => skus.filter(x => !failed.includes(x)))
    );
  }
}
