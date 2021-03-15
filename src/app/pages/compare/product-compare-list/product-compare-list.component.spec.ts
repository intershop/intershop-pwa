import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { ProductView, createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product } from 'ish-core/models/product/product.model';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductRatingComponent } from 'ish-shared/components/product/product-rating/product-rating.component';

import { ProductComparePagingComponent } from '../product-compare-paging/product-compare-paging.component';

import { ProductCompareListComponent } from './product-compare-list.component';

describe('Product Compare List Component', () => {
  let fixture: ComponentFixture<ProductCompareListComponent>;
  let component: ProductCompareListComponent;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;
  let translate: TranslateService;
  let compareProduct1: ProductView;
  let compareProduct2: ProductView;

  beforeEach(async () => {
    compareProduct1 = createProductView({ sku: '111', available: true } as Product);
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

    shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.product$(compareProduct1.sku, anything())).thenReturn(of(compareProduct1));
    when(shoppingFacade.product$(compareProduct2.sku, anything())).thenReturn(of(compareProduct2));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductAttributesComponent),
        MockComponent(ProductComparePagingComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductNameComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductRatingComponent),
        MockDirective(FeatureToggleDirective),
        MockDirective(ProductContextDirective),
        MockPipe(AttributeToStringPipe),
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

  it('should use facade remove from compare when click on remove compare product', () => {
    component.removeFromCompare('111');

    verify(shoppingFacade.removeProductFromCompare('111')).once();
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
