import { AsyncPipe } from '@angular/common';
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductItemVariationsComponent } from 'ish-shared/components/product/product-item-variations/product-item-variations.component';
import { ProductLabelComponent } from 'ish-shared/components/product/product-label/product-label.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';

import { ProductAddToCompareComponent } from '../../../../extensions/compare/shared/product-add-to-compare/product-add-to-compare.component';
import { ProductAddToOrderTemplateComponent } from '../../../../extensions/order-templates/shared/product-add-to-order-template/product-add-to-order-template.component';
import { ProductAddToQuoteComponent } from '../../../../extensions/quoting/shared/product-add-to-quote/product-add-to-quote.component';
import { ProductRatingComponent } from '../../../../extensions/rating/shared/product-rating/product-rating.component';
import { ProductAddToWishlistComponent } from '../../../../extensions/wishlists/shared/product-add-to-wishlist/product-add-to-wishlist.component';

import { ProductTileComponent } from './product-tile.component';

@Directive({
  selector: '[ishFeature]',
  standalone: true,
})
class MockFeatureToggleDirective {
  @Input('ishFeature') feature: unknown;

  constructor(templateRef: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    viewContainerRef.createEmbeddedView(templateRef);
  }
}

describe('Product Tile Component', () => {
  let component: ProductTileComponent;
  let fixture: ComponentFixture<ProductTileComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(of({ sku: 'SKU' } as ProductView));
    when(context.select('displayProperties', anyString())).thenReturn(of(true));
    when(context.select('displayProperties', 'readOnly')).thenReturn(of(false));

    await TestBed.configureTestingModule({
      imports: [ProductTileComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
    })
      .overrideComponent(ProductTileComponent, {
        remove: {
          imports: [
            AsyncPipe,
            FeatureToggleDirective,
            ProductAddToBasketComponent,
            ProductAddToCompareComponent,
            ProductAddToOrderTemplateComponent,
            ProductAddToQuoteComponent,
            ProductAddToWishlistComponent,
            ProductImageComponent,
            ProductItemVariationsComponent,
            ProductLabelComponent,
            ProductNameComponent,
            ProductPriceComponent,
            ProductPromotionComponent,
            ProductRatingComponent,
          ],
        },
        add: {
          imports: [
            AsyncPipe,
            MockFeatureToggleDirective,
            MockComponent(ProductAddToBasketComponent),
            MockComponent(ProductAddToCompareComponent),
            MockComponent(ProductAddToOrderTemplateComponent),
            MockComponent(ProductAddToQuoteComponent),
            MockComponent(ProductAddToWishlistComponent),
            MockComponent(ProductImageComponent),
            MockComponent(ProductItemVariationsComponent),
            MockComponent(ProductLabelComponent),
            MockComponent(ProductNameComponent),
            MockComponent(ProductPriceComponent),
            MockComponent(ProductPromotionComponent),
            MockComponent(ProductRatingComponent),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render default elements when not specifically configured', async () => {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
        "ish-product-image",
        "ish-product-label",
        "ish-product-name",
        "ish-product-rating",
        "ish-product-promotion",
        "ish-product-price",
        "ish-product-item-variations",
        "ish-product-add-to-quote",
        "ish-product-add-to-compare",
        "ish-product-add-to-order-template",
        "ish-product-add-to-wishlist",
        "ish-product-add-to-basket",
      ]
    `);
  });
});
