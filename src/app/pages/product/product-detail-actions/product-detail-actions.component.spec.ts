import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, TranslateService, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FeatureToggleDirective, FeatureToggleModule } from 'ish-core/feature-toggle.imports';
import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product } from 'ish-core/models/product/product.model';

import { ProductSendToCompareComponent } from '../../../extensions/compare/shared/product-send-to-compare/product-send-to-compare.component';
import { ProductAddToWishlistComponent } from '../../../extensions/wishlists/shared/product-add-to-wishlist/product-add-to-wishlist.component';

import { ProductDetailActionsComponent } from './product-detail-actions.component';

describe('Product Detail Actions Component', () => {
  let component: ProductDetailActionsComponent;
  let fixture: ComponentFixture<ProductDetailActionsComponent>;
  let translate: TranslateService;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    await TestBed.configureTestingModule({
      imports: [ProductDetailActionsComponent],
      providers: [
        ...(FeatureToggleModule.forTesting('compare').providers ?? []),
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        provideTranslateService(),
      ],
    })
      .overrideComponent(ProductDetailActionsComponent, {
        set: {
          imports: [
            FeatureToggleDirective,
            MockComponent(ProductAddToWishlistComponent),
            MockComponent(ProductSendToCompareComponent),
            AsyncPipe,
            TranslatePipe,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailActionsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    translate = TestBed.inject(TranslateService);
    translate.setFallbackLang('en');
    translate.use('en');

    const product = { sku: 'sku', available: true } as Product;
    when(context.select('product')).thenReturn(of(createProductView(product)));
    when(context.select('displayProperties', anyString())).thenReturn(of(true));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('link rendering', () => {
    it(`should show "email to friend" link when product information is available`, () => {
      fixture.detectChanges();

      expect(element.querySelector('i.bi-share-fill')).toBeTruthy();
    });

    it(`should show "print page" link when product information is available`, () => {
      fixture.detectChanges();

      expect(element.querySelector('i.bi-printer-fill')).toBeTruthy();
    });

    it(`should show "compare" link when product information is available`, () => {
      fixture.detectChanges();

      expect(element.querySelector("[data-testing-id='compare-sku']")).toBeTruthy();
    });

    it('should not show "compare" link when product information is available and productMaster = true', () => {
      when(context.select('product')).thenReturn(
        of(createProductView({ sku: 'SKU', type: 'VariationProductMaster' } as Product))
      );
      fixture.detectChanges();

      expect(element.querySelector("[data-testing-id='compare-sku']")).toBeFalsy();
    });
  });
});
