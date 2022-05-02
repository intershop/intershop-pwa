import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-product-list-category',
  templateUrl: './cms-product-list-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSProductListCategoryComponent implements CMSComponent, OnChanges {
  @Input() pagelet: ContentPageletView;

  productSKUs$: Observable<string[]>;

  constructor(private cmsFacade: CMSFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnChanges() {
    if (this.pagelet.hasParam('Category')) {
      this.productSKUs$ = this.getProductSKUs$();
    }
  }

  getProductSKUs$(): Observable<string[]> {
    return this.shoppingFacade.categoryIdByRefId$(this.pagelet.stringParam('Category')).pipe(
      whenTruthy(),
      switchMap(categoryId =>
        this.cmsFacade.parameterProductListFilter$(
          categoryId,
          undefined,
          undefined,
          this.pagelet.numberParam('MaxNumberOfProducts')
        )
      )
    );
  }
}
