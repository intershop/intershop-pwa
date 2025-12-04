import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductTileComponent } from '../product-tile/product-tile.component';
import { ProductRowComponent } from '../product-row/product-row.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { AsyncPipe, NgIf } from '@angular/common';

export type ProductItemDisplayType = 'tile' | 'row';

/**
 * The Product Item Component renders the product either as 'tile' or 'row'.
 * The 'tile' rendering is the default if no value is provided for the displayType.
 */
@Component({
  selector: 'ish-product-item',
  templateUrl: './product-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ProductTileComponent, ProductRowComponent, LoadingComponent, NgIf, AsyncPipe],
})
export class ProductItemComponent implements OnInit {
  @Input() displayType: ProductItemDisplayType = 'tile';

  product$: Observable<ProductView>;
  loading$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.loading$ = this.context.select('loading');
  }

  get isTile() {
    return this.displayType === 'tile';
  }

  get isRow() {
    return !this.isTile;
  }
}
