import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AttributeToStringPipe } from '../../../../models/attribute/attribute.pipe';
import { Product } from '../../../../models/product/product.model';
import { ProductAddToCartComponent } from '../product-add-to-cart/product-add-to-cart.component';
import { ProductAttributesComponent } from '../product-attributes/product-attributes.component';
import { ProductImageComponent } from '../product-image/product-image.component';
import { ProductPriceComponent } from '../product-price/product-price.component';
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
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot({})
      ],
      declarations: [
        ProductCompareListComponent,
        ProductImageComponent,
        ProductAddToCartComponent,
        ProductAttributesComponent,
        ProductPriceComponent,
        AttributeToStringPipe
      ],
      providers: [
        CurrencyPipe,
        DatePipe,
        DecimalPipe
      ]
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
    compareProduct1.images = [
      {
        'name': 'front M',
        'type': 'Image',
        'imageActualHeight': 110,
        'imageActualWidth': 110,
        'viewID': 'front',
        'effectiveUrl': '',
        'typeID': 'M',
        'primaryImage': true
      }

    ];
    compareProduct1.attributes = [
      {
        'name': 'Optical zoom',
        'type': 'String',
        'value': '20 x'
      },
      {
        'name': 'Focal length (35mm film equivalent)',
        'type': 'String',
        'value': '40 - 800 mm'
      },
      {
        'name': 'Image formats supported',
        'type': 'String',
        'value': '1920 x 1080, 1600 x 1200, 640 x 480'
      }];

    compareProduct2 = {
      ...compareProduct1, sku: '112', attributes: [{
        'name': 'Optical zoom',
        'type': 'String',
        'value': '20 x'
      }]
    };
    component.compareProducts = [compareProduct1, compareProduct2];
    component.totalItems = 2;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit removeProductCompare when click on remove compare product', () => {
    component.removeProductCompare.subscribe((sku: string) => {
      expect(sku).toBe('111');
    });
    component.removeCompareProduct('111');
  });

  it('should emit add to cart when click on add to cart button', () => {
    component.productToCart.subscribe((sku: any) => {
      expect(sku).toEqual({ 'sku': '111', 'quantity': 1 });
    });
    component.addToCart('111', 1);
  });

  it('should test if getCommonAttributeNames method return correct list', () => {
    expect(new Set(component.getCommonAttributeNames()).size).toEqual(1);
  });

});
