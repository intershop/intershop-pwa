import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductPrices } from 'ish-core/models/product/product.model';

import { ProductPriceComponent } from './product-price.component';

describe('Product Price Component', () => {
  let component: ProductPriceComponent;
  let fixture: ComponentFixture<ProductPriceComponent>;
  let element: HTMLElement;
  let translate: TranslateService;
  let product: ProductPrices;

  beforeEach(async () => {
    product = {
      listPrice: {
        type: 'Money',
        value: 11,
        currency: 'USD',
      },
      salePrice: {
        type: 'Money',
        value: 10,
        currency: 'USD',
      },
    };

    const accountFacade = mock(AccountFacade);
    when(accountFacade.userPriceDisplayType$).thenReturn(of('gross'));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [PricePipe, ProductPriceComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    translate = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(ProductPriceComponent);
    component = fixture.componentInstance;
    translate.setDefaultLang('en');
    translate.use('en');
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
    it.each([
      [false, false, 'list price equals sale price', 10, 10],
      [true, false, 'list price is greater than sale price', 11, 10],
      [false, true, 'list price is less than sale price', 10, 11],
    ])(
      `should evaluate isListPriceGreaterThanSalePrice to "%s" and isListPriceLessThanSalePrice to "%s" when %s`,
      (isListPriceGreaterThanSalePrice, isListPriceLessThanSalePrice, _, listPrice, salePrice) => {
        product.listPrice.value = listPrice;
        product.salePrice.value = salePrice;
        component.ngOnChanges();
        expect(component.isListPriceGreaterThanSalePrice).toBe(isListPriceGreaterThanSalePrice);
        expect(component.isListPriceLessThanSalePrice).toBe(isListPriceLessThanSalePrice);
      }
    );
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

      it.each([
        ['.current-price', 'list price equals sale price', false, false],
        ['.current-price.sale-price', 'list price is greater than sale price', true, false],
        ['.current-price.sale-price-higher', 'list price is less than sale price', false, true],
      ])(
        `should apply "%s" class when showInformationalPrice = true and %s`,
        (querySelector, _, isListPriceGreaterThanSalePrice, isListPriceLessThanSalePrice) => {
          component.isListPriceGreaterThanSalePrice = isListPriceGreaterThanSalePrice;
          component.isListPriceLessThanSalePrice = isListPriceLessThanSalePrice;
          fixture.detectChanges();
          expect(element.querySelector(querySelector)).toBeTruthy();
        }
      );
    });

    it('should generate rich snippet meta tag when sale price is available', () => {
      fixture.detectChanges();
      expect(element.querySelector('meta[itemprop="price"]').getAttribute('content')).toEqual('10.00');
      expect(element.querySelector('meta[itemprop="priceCurrency"]').getAttribute('content')).toEqual('USD');
    });
  });
});
