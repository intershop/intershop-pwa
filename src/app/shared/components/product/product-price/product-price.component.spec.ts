import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Price, Pricing } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';

import { ProductPriceComponent } from './product-price.component';

function dummyPricing(list: number, sale: number, scale?: [number, number][]): Pricing {
  return {
    listPrice: list !== undefined && {
      type: 'Money',
      value: list,
      currency: 'USD',
    },
    salePrice: sale !== undefined && {
      type: 'Money',
      value: sale,
      currency: 'USD',
    },
    scaledPrices: scale?.map(([value, minQuantity]) => ({
      type: 'Money',
      currency: 'USD',
      value,
      minQuantity,
    })),
  };
}

describe('Product Price Component', () => {
  let component: ProductPriceComponent;
  let fixture: ComponentFixture<ProductPriceComponent>;
  let element: HTMLElement;
  let translate: TranslateService;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'price')).thenReturn(of(true));
    when(context.select('product')).thenReturn(of({ sku: '123' }));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockPipe(PricePipe, (price: Price) => `\$${price.value?.toFixed(2)}`), ProductPriceComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPriceComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('template rendering', () => {
    it('should show "N/A" text when sale price is not available', () => {
      translate.set('product.price.na.text', 'N/A');
      when(context.select('prices')).thenReturn(of(dummyPricing(11, undefined)));
      fixture.detectChanges();

      expect(element.querySelector('.current-price').textContent.trim()).toEqual('N/A');
    });

    it('should show "$10.00" when no list price is available but a sale price', () => {
      translate.set('product.price.salePriceFallback.text', '{{0}}');
      when(context.select('prices')).thenReturn(of(dummyPricing(undefined, 10)));
      fixture.detectChanges();

      expect(element.querySelector('.current-price').textContent.trim()).toEqual('$10.00');
    });

    it('should show sale price with salePricePrefix text when sale price < list price', () => {
      translate.set('product.price.salePricePrefix.text', '{{0}}');
      when(context.select('prices')).thenReturn(of(dummyPricing(11, 10)));
      fixture.detectChanges();

      expect(element.querySelector('.current-price').textContent.trim()).toEqual('$10.00');
    });

    it('should show sale price with salePriceFallback text when sale price = list price', () => {
      translate.set('product.price.salePriceFallback.text', '{{0}}');
      when(context.select('prices')).thenReturn(of(dummyPricing(10, 10)));
      fixture.detectChanges();

      expect(element.querySelector('.current-price').textContent.trim()).toEqual('$10.00');
    });

    it('should show list price as old price when showInformationalPrice = true and sale price < list price', () => {
      translate.set('product.price.listPriceFallback.text', '{{0}}');
      when(context.select('prices')).thenReturn(of(dummyPricing(11, 10)));
      component.showInformationalPrice = true;
      fixture.detectChanges();

      expect(element.querySelector('.old-price').textContent.trim()).toEqual('$11.00');
    });

    it('should show price saving when showInformationalPrice and showPriceSavings = true and sale price < list price', () => {
      translate.set('product.price.savingsFallback.text', 'you saved {{0}}');
      when(context.select('prices')).thenReturn(of(dummyPricing(11, 10)));
      component.showInformationalPrice = true;
      component.showPriceSavings = true;
      fixture.detectChanges();

      expect(element.querySelector('.price-savings').textContent.trim()).toEqual('you saved $1.00');
    });

    describe('sale price css', () => {
      beforeEach(() => {
        translate.set('product.price.savingsFallback.text', 'you saved {{0}}');
        component.showInformationalPrice = true;
      });

      it.each([
        ['.current-price', 'list price equals sale price', 10, 10],
        ['.current-price.sale-price', 'list price is greater than sale price', 11, 10],
        ['.current-price.sale-price-higher', 'list price is less than sale price', 10, 11],
      ])(`should apply "%s" class when showInformationalPrice = true and %s`, (querySelector, _, list, sale) => {
        when(context.select('prices')).thenReturn(of(dummyPricing(list, sale)));
        fixture.detectChanges();

        expect(element.querySelector(querySelector)).toBeTruthy();
      });
    });

    it('should generate rich snippet meta tag when sale price is available', () => {
      when(context.select('prices')).thenReturn(of(dummyPricing(11, 10)));
      fixture.detectChanges();

      expect(element.querySelector('meta[itemprop="price"]').getAttribute('content')).toEqual('10.00');
      expect(element.querySelector('meta[itemprop="priceCurrency"]').getAttribute('content')).toEqual('USD');
    });

    it('should show scaled prices when configured and scaled prices are available', () => {
      component.showScaledPrices = true;

      translate.set('product.price.scaledPrice.text', 'Buy {{0}}-{{1}} for {{2}} each');
      translate.set('product.price.scaledPrice.text.last', 'Buy {{0}}+ for {{1}} each');
      translate.set('product.price.scaledPrice.single.text', 'Buy {{0}} for {{1}} each');
      when(context.select('prices')).thenReturn(
        of(
          dummyPricing(300, 250, [
            [240, 2],
            [220, 3],
            [200, 5],
          ])
        )
      );
      fixture.detectChanges();

      expect(element.querySelector('[data-testing-id=scaled-prices]')).toMatchInlineSnapshot(`
        <div data-testing-id="scaled-prices" class="scaled-prices">
          <div>Buy 2 for $240.00 each</div>
          <div>Buy 3-4 for $220.00 each</div>
          <div>Buy 5+ for $200.00 each</div>
        </div>
      `);
    });
  });
});
