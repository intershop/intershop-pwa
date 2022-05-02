import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-product-list-filter',
  templateUrl: './cms-product-list-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSProductListFilterComponent implements CMSComponent, OnChanges {
  @Input() pagelet: ContentPageletView;

  productSKUs$: Observable<string[]>;

  constructor(private cmsFacade: CMSFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnChanges() {
    if (this.pagelet.hasParam('Filter')) {
      this.productSKUs$ = this.getProductSKUs$();
    }
  }

  getProductSKUs$(): Observable<string[]> {
    return this.shoppingFacade.selectedCategoryId$.pipe(
      switchMap(categoryId =>
        this.cmsFacade.parameterProductListFilter$(
          categoryId,
          this.pagelet.stringParam('Filter'),
          this.pagelet.stringParam('Scope'),
          this.pagelet.numberParam('MaxNumberOfProducts')
        )
      )
    );
  }
}
