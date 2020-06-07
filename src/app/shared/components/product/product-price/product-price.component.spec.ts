import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as using from 'jasmine-data-provider';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { AnyProductType } from 'ish-core/models/product/product.model';

import { ProductPriceComponent } from './product-price.component';

describe('Product Price Component', () => {
  let component: ProductPriceComponent;
  let fixture: ComponentFixture<ProductPriceComponent>;
  let element: HTMLElement;
  let translate: TranslateService;
  let product: AnyProductType;

  beforeEach(async(() => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.userPriceDisplayType$).thenReturn(of('gross'));

    TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot()],
      declarations: [PricePipe, ProductPriceComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    translate = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(ProductPriceComponent);
    component = fixture.componentInstance;
    translate.setDefaultLang('en');
    translate.use('en');
    product = { sku: 'sku' } as AnyProductType;
    product.listPrice = {
      type: 'Money',
      value: 11,
      currency: 'USD',
    };
    product.salePrice = {
      type: 'Money',
      value: 10,
      currency: 'USD',
    };
    component.product = product;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter product is not set properly', () => {
    component.product = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  describe('price comparison', () => {
    function dataProvider() {
      return [
        {
          listPrice: 10,
          salePrice: 10,
          isListPriceGreaterThanSalePrice: false,
          isListPriceLessThanSalePrice: false,
          description: 'list price equals sale price',
        },
        {
          listPrice: 11,
          salePrice: 10,
          isListPriceGreaterThanSalePrice: true,
          isListPriceLessThanSalePrice: false,
          description: 'list price is greater than sale price',
        },
        {
          listPrice: 10,
          salePrice: 11,
          isListPriceGreaterThanSalePrice: false,
          isListPriceLessThanSalePrice: true,
          description: 'list price is less than sale price',
        },
      ];
    }
    using(dataProvider, dataSlice => {
      it(`should evaluate isListPriceGreaterThanSalePrice to "${dataSlice.isListPriceGreaterThanSalePrice}" and isListPriceLessThanSalePrice to "${dataSlice.isListPriceLessThanSalePrice}" when ${dataSlice.description}`, () => {
        product.listPrice.value = dataSlice.listPrice;
        product.salePrice.value = dataSlice.salePrice;
        component.ngOnChanges();
        expect(component.isListPriceGreaterThanSalePrice).toBe(dataSlice.isListPriceGreaterThanSalePrice);
        expect(component.isListPriceLessThanSalePrice).toBe(dataSlice.isListPriceLessThanSalePrice);
      });
    });
  });

  describe('template rendering', () => {
    it('should show "N/A" text when sale price is not available', () => {
      translate.set('product.price.na.text', 'N/A');
      product.salePrice = undefined;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('.current-price').textContent.trim()).toEqual('N/A');
    });

    it('should show "$10.00" when no list price is available but a sale price', () => {
      translate.set('product.price.salePriceFallback.text', '{{0}}');
      product.listPrice = undefined;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('.current-price').textContent.trim()).toEqual('$10.00');
    });

    it('should show sale price with salePricePrefix text when sale price < list price', () => {
      translate.set('product.price.salePricePrefix.text', '{{0}}');
      component.isListPriceGreaterThanSalePrice = true;
      component.isListPriceLessThanSalePrice = false;
      fixture.detectChanges();
      expect(element.querySelector('.current-price').textContent.trim()).toEqual('$10.00');
    });

    it('should show sale price with salePriceFallback text when sale price = list price', () => {
      translate.set('product.price.salePriceFallback.text', '{{0}}');
      component.isListPriceGreaterThanSalePrice = false;
      component.isListPriceLessThanSalePrice = false;
      fixture.detectChanges();
      expect(element.querySelector('.current-price').textContent.trim()).toEqual('$10.00');
    });

    it('should show list price as old price when showInformationalPrice = true and sale price < list price', () => {
      translate.set('product.price.listPriceFallback.text', '{{0}}');
      component.showInformationalPrice = true;
      component.isListPriceGreaterThanSalePrice = true;
      component.isListPriceLessThanSalePrice = false;
      fixture.detectChanges();
      expect(element.querySelector('.old-price').textContent.trim()).toEqual('$11.00');
    });

    it('should show price saving when showPriceSavings = true and sale price < list price', () => {
      translate.set('product.price.savingsFallback.text', 'you saved {{0}}');
      component.showPriceSavings = true;
      component.isListPriceGreaterThanSalePrice = true;
      component.isListPriceLessThanSalePrice = false;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('.price-savings').textContent.trim()).toEqual('you saved $1.00');
    });

    describe('sale price css', () => {
      beforeEach(() => {
        translate.set('product.price.savingsFallback.text', 'you saved {{0}}');
        component.showInformationalPrice = true;
      });
      function dataProvider() {
        return [
          {
            isListPriceGreaterThanSalePrice: false,
            isListPriceLessThanSalePrice: false,
            querySelector: '.current-price',
            description: 'list price equals sale price',
          },
          {
            isListPriceGreaterThanSalePrice: true,
            isListPriceLessThanSalePrice: false,
            querySelector: '.current-price.sale-price',
            description: 'list price is greater than sale price',
          },
          {
            isListPriceGreaterThanSalePrice: false,
            isListPriceLessThanSalePrice: true,
            querySelector: '.current-price.sale-price-higher',
            description: 'list price is less than sale price',
          },
        ];
      }
      using(dataProvider, dataSlice => {
        it(`should apply "${dataSlice.querySelector}" class when showInformationalPrice = true and ${dataSlice.description}`, () => {
          component.isListPriceGreaterThanSalePrice = dataSlice.isListPriceGreaterThanSalePrice;
          component.isListPriceLessThanSalePrice = dataSlice.isListPriceLessThanSalePrice;
          fixture.detectChanges();
          expect(element.querySelector(dataSlice.querySelector)).toBeTruthy();
        });
      });
    });

    it('should generate rich snippet meta tag when sale price is available', () => {
      fixture.detectChanges();
      expect(element.querySelector('meta[itemprop="price"]').getAttribute('content')).toEqual('10.00');
      expect(element.querySelector('meta[itemprop="priceCurrency"]').getAttribute('content')).toEqual('USD');
    });
  });
});
