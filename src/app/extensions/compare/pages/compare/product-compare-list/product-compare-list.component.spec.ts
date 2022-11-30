import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { ProductView, createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product } from 'ish-core/models/product/product.model';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';

import { CompareFacade } from '../../../facades/compare.facade';
import { ProductComparePagingComponent } from '../product-compare-paging/product-compare-paging.component';

import { ProductCompareListComponent } from './product-compare-list.component';

describe('Product Compare List Component', () => {
  let fixture: ComponentFixture<ProductCompareListComponent>;
  let component: ProductCompareListComponent;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;
  let compareFacade: CompareFacade;
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

    compareFacade = mock(CompareFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(ProductAttributesComponent),
        MockComponent(ProductComparePagingComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductNameComponent),
        MockComponent(ProductPriceComponent),
        MockDirective(FeatureToggleDirective),
        MockDirective(ProductContextDirective),
        MockDirective(ServerHtmlDirective),
        MockPipe(AttributeToStringPipe),
        ProductCompareListComponent,
      ],
      providers: [
        { provide: CompareFacade, useFactory: () => instance(compareFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
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

    verify(compareFacade.removeProductFromCompare('111')).once();
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
