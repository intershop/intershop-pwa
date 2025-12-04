import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';
import { ProductsListComponent } from 'ish-shared/components/product/products-list/products-list.component';

@Component({
  selector: 'ish-cms-product-list-recommendations',
  templateUrl: './cms-product-list-recommendations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, NgClass, ProductsListComponent],
})
export class CMSProductListRecommendationsComponent implements CMSComponent, OnChanges {
  @Input({ required: true }) pagelet: ContentPageletView;

  productSKUs$: Observable<string[]>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnChanges() {
    const maxNumberOfProducts = this.pagelet.numberParam('MaxNumberOfProducts') || undefined;

    this.productSKUs$ = this.shoppingFacade
      .productRecommendations$({ strategy: this.pagelet.stringParam('Strategy'), maxCount: maxNumberOfProducts })
      .pipe(
        map(recommendation =>
          recommendation?.productSKUs ? recommendation?.productSKUs.slice(0, maxNumberOfProducts) : []
        ),
        tap(skus => console.log('CMSProductListRecommendations SKUs:', skus))
      );
  }
}
