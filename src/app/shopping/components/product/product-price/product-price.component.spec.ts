import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Product } from '../../../../models/product/product.model';
import { ProductPriceComponent } from './product-price.component';

describe('Product Price Component', () => {
  let component: ProductPriceComponent;
  let fixture: ComponentFixture<ProductPriceComponent>;
  let element: HTMLElement;
  let translate: TranslateService;
  let product: Product;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        TranslateService
      ],
      declarations: [ProductPriceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    translate = TestBed.get(TranslateService);
    fixture = TestBed.createComponent(ProductPriceComponent);
    component = fixture.componentInstance;
    translate.setDefaultLang('en');
    translate.use('en');
    product = new Product('sku');
    product.listPrice = {
      'type': 'ProductPrice',
      'value': 10,
      'currencyMnemonic': 'USD',
    };
    product.salePrice = {
      'type': 'ProductPrice',
      'value': 11,
      'currencyMnemonic': 'USD',
    };
    component.product = product;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should throw an error if input parameter product is not set properly', () => {
    component.product = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should show sale price with salePricePrefix text when sale price < list price', () => {

    translate.set('product.price.salePricePrefix.text', '{{0}}');
    product.salePrice.value = 10;
    product.listPrice.value = 11;
    fixture.detectChanges();
    expect(element.querySelector('.current-price').textContent.trim()).toEqual('$10.00');
  });

  it('should show sale price with salePriceFallback text when sale price >= list price', () => {
    translate.set('product.price.salePriceFallback.text', '{{0}}');
    product.salePrice.value = 10;
    product.listPrice.value = 10;
    fixture.detectChanges();
    expect(element.querySelector('.current-price').textContent.trim()).toEqual('$10.00');
  });

  it('should show N/A text when sale price is not available', () => {
    translate.set('product.price.na.text', 'N/A');
    product.salePrice = null;
    fixture.detectChanges();
    expect(element.querySelector('.current-price').textContent.trim()).toEqual('N/A');
  });

  it('should show list price as old price when showInformationalPrice = true and sale price < list price', () => {
    translate.set('product.price.listPriceFallback.text', '{{0}}');
    component.showInformationalPrice = true;
    product.salePrice.value = 10;
    product.listPrice.value = 11;
    fixture.detectChanges();
    expect(element.querySelector('.old-price').textContent.trim()).toEqual('$11.00');
  });

  it('should show price saving when showPriceSavings = true and sale price < list price', () => {
    translate.set('product.price.savingsFallback.text', 'you saved {{0}}');
    component.showPriceSavings = true;
    product.salePrice.value = 10;
    product.listPrice.value = 11;
    fixture.detectChanges();
    expect(element.querySelector('.price-savings').textContent.trim()).toEqual('you saved $1.00');
  });

  it('should generate rich snippet meta tag when sale price is available', () => {
    product.salePrice.value = 10;
    fixture.detectChanges();
    expect(element.querySelector('meta[itemprop=\'price\']').attributes['content'].value === '10.00').toBeTruthy();
    expect(element.querySelector('meta[itemprop=\'priceCurrency\']').attributes['content'].value === 'USD').toBeTruthy();
  });

  describe('sale price css', () => {
    it('should apply "current-price sale-price-higher" class when showInformationalPrice = true and sale price > list price ', () => {
      translate.set('product.price.savingsFallback.text', 'you saved {{0}}');
      component.showInformationalPrice = true;
      product.salePrice.value = 11;
      product.listPrice.value = 10;
      fixture.detectChanges();
      expect(element.querySelector('.current-price.sale-price-higher')).toBeTruthy();
    });

    it('should apply "current-price sale-price" class when showInformationalPrice = true and sale price < list price ', () => {
      translate.set('product.price.savingsFallback.text', 'you saved {{0}}');
      component.showInformationalPrice = true;
      product.salePrice.value = 10;
      product.listPrice.value = 11;
      fixture.detectChanges();
      expect(element.querySelector('.current-price.sale-price')).toBeTruthy();
    });

    it('should apply current-price class when showInformationalPrice = true and sale price = list price ', () => {
      translate.set('product.price.savingsFallback.text', 'you saved {{0}}');
      component.showInformationalPrice = true;
      product.salePrice.value = 10;
      product.listPrice.value = 10;
      fixture.detectChanges();
      expect(element.querySelector('.current-price')).toBeTruthy();
    });
  });
});
