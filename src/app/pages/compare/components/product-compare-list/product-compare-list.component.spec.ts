import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { IconModule } from 'ish-core/icon.module';
import { Product } from 'ish-core/models/product/product.model';
import { PipesModule } from 'ish-core/pipes.module';
import { ProductAddToBasketComponent } from '../../../../shared/product/components/product-add-to-basket/product-add-to-basket.component';
import { ProductAttributesComponent } from '../../../../shared/product/components/product-attributes/product-attributes.component';
import { ProductInventoryComponent } from '../../../../shared/product/components/product-inventory/product-inventory.component';
import { ProductPriceComponent } from '../../../../shared/product/components/product-price/product-price.component';
import { ProductImageComponent } from '../../../../shell/header/components/product-image/product-image.component';
import { ProductComparePagingComponent } from '../product-compare-paging/product-compare-paging.component';

import { ProductCompareListComponent } from './product-compare-list.component';

describe('Product Compare List Component', () => {
  let fixture: ComponentFixture<ProductCompareListComponent>;
  let component: ProductCompareListComponent;
  let element: HTMLElement;
  let translate: TranslateService;
  let compareProduct1: Product;
  let compareProduct2: Product;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconModule, PipesModule, RouterTestingModule, StoreModule.forRoot({}), TranslateModule.forRoot()],
      declarations: [
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductAttributesComponent),
        MockComponent(ProductComparePagingComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductPriceComponent),
        ProductCompareListComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCompareListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    element = fixture.nativeElement;
    compareProduct1 = { sku: '111', inStock: true, availability: true } as Product;
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
    component.compareProducts = [compareProduct1, compareProduct2];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
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

  it('should return 1 as the number of Common Attribute Names for the compared products', () => {
    expect(new Set(component.getCommonAttributeNames()).size).toEqual(1);
  });

  it('should switch to lower page when number of products is reduced', () => {
    component.compareProducts = [compareProduct1, compareProduct1, compareProduct1, compareProduct1];
    component.changeCurrentPage(2);
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.currentPage).toEqual(2);

    component.compareProducts = [compareProduct1];
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.currentPage).toEqual(1);
  });
});
