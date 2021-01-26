import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { ProductView, createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product } from 'ish-core/models/product/product.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductRatingComponent } from 'ish-shared/components/product/product-rating/product-rating.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { ProductComparePagingComponent } from '../product-compare-paging/product-compare-paging.component';

import { ProductCompareListComponent } from './product-compare-list.component';

describe('Product Compare List Component', () => {
  let fixture: ComponentFixture<ProductCompareListComponent>;
  let component: ProductCompareListComponent;
  let element: HTMLElement;
  let translate: TranslateService;
  let compareProduct1: ProductView;
  let compareProduct2: ProductView;

  beforeEach(async () => {
    compareProduct1 = createProductView({ sku: '111', available: true } as Product, categoryTree());
    compareProduct1.attributes = [
      {
        name: 'Optical zoom',
        type: 'String',
        value: '20 x',
      },
      {
        name: 'Focal length (35mm film equivalent)',
        type: 'String',
        value: '40 - 800 mm',
      },
      {
        name: 'Image formats supported',
        type: 'String',
        value: '1920 x 1080, 1600 x 1200, 640 x 480',
      },
    ];

    compareProduct2 = {
      ...compareProduct1,
      sku: '112',
      attributes: [
        {
          name: 'Optical zoom',
          type: 'String',
          value: '20 x',
        },
      ],
    };

    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.product$(compareProduct1.sku, anything())).thenReturn(of(compareProduct1));
    when(shoppingFacade.product$(compareProduct2.sku, anything())).thenReturn(of(compareProduct2));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductAttributesComponent),
        MockComponent(ProductComparePagingComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductRatingComponent),
        MockDirective(FeatureToggleDirective),
        MockPipe(AttributeToStringPipe),
        MockPipe(ProductRoutePipe),
        ProductCompareListComponent,
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCompareListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    element = fixture.nativeElement;
    component.compareProducts = [compareProduct1.sku, compareProduct2.sku];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit removeProductCompare when click on remove compare product', done => {
    component.removeProductCompare.subscribe(sku => {
      expect(sku).toBe('111');
      done();
    });
    component.removeFromCompare('111');
  });

  it('should emit add to basket when click on add to basket button', done => {
    component.productToBasket.subscribe(data => {
      expect(data).toEqual({ sku: '111', quantity: 1 });
      done();
    });
    component.addToBasket('111', 1);
  });

  it('should switch to lower page when number of products is reduced', () => {
    component.compareProducts = [compareProduct1.sku, compareProduct1.sku, compareProduct1.sku, compareProduct1.sku];
    component.changeCurrentPage(2);
    fixture.detectChanges();

    expect(component.currentPage).toEqual(2);

    component.compareProducts = [compareProduct1.sku];
    fixture.detectChanges();

    expect(component.currentPage).toEqual(1);
  });
});
