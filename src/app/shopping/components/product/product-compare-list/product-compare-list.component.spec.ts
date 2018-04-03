import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Product } from '../../../../models/product/product.model';
import { AttributeToStringPipe } from '../../../../shared/pipes/attribute.pipe';
import { PricePipe } from '../../../../shared/pipes/price.pipe';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ProductCompareListComponent } from './product-compare-list.component';

describe('Product Compare List Component', () => {
  let fixture: ComponentFixture<ProductCompareListComponent>;
  let component: ProductCompareListComponent;
  let element: HTMLElement;
  let translate: TranslateService;
  let compareProduct1: Product;
  let compareProduct2: Product;
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, TranslateModule.forRoot(), StoreModule.forRoot({})],
        declarations: [
          ProductCompareListComponent,
          MockComponent({
            selector: 'ish-product-compare-paging',
            template: 'Product Compare Paging Component',
            inputs: ['itemsPerPage', 'currentPage', 'totalItems'],
          }),
          MockComponent({ selector: 'ish-product-image', template: 'Product Image Component', inputs: ['product'] }),
          MockComponent({
            selector: 'ish-product-price',
            template: 'Product Price Component',
            inputs: ['product', 'showInformationalPrice'],
          }),
          MockComponent({ selector: 'ish-product-add-to-cart', template: 'Product Add To Cart', inputs: ['product'] }),
          MockComponent({
            selector: 'ish-product-inventory',
            template: 'Product Inventory Component',
            inputs: ['product'],
          }),
          MockComponent({
            selector: 'ish-product-attributes',
            template: 'Product Attributes Component',
            inputs: ['product'],
          }),
          AttributeToStringPipe,
          PricePipe,
        ],
        providers: [CurrencyPipe, DatePipe, DecimalPipe, PricePipe],
      }).compileComponents();
    })
  );

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
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit removeProductCompare when click on remove compare product', () => {
    component.removeProductCompare.subscribe(sku => {
      expect(sku).toBe('111');
    });
    component.removeFromCompare('111');
  });

  it('should emit add to cart when click on add to cart button', () => {
    component.productToCart.subscribe(data => {
      expect(data).toEqual({ sku: '111', quantity: 1 });
    });
    component.addToCart('111', 1);
  });

  it('should return 1 as the number of Common Attribute Names for the compared products', () => {
    expect(new Set(component.getCommonAttributeNames()).size).toEqual(1);
  });
});
