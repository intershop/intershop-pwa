import { CommonModule, CurrencyPipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BasketItem } from '../../../../models/basket-item/basket-item.model';
import { Basket } from '../../../../models/basket/basket.model';
import { Product } from '../../../../models/product/product.model';
import { PipesModule } from '../../../../shared/pipes.module';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { MiniBasketComponent } from './mini-basket.component';

describe('Mini Basket Component', () => {
  let fixture: ComponentFixture<MiniBasketComponent>;
  let component: MiniBasketComponent;
  let element: HTMLElement;
  let product: Product;
  let lineItem: BasketItem;
  let basket: Basket;
  let translate: TranslateService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          CollapseModule.forRoot(),
          CommonModule,
          RouterTestingModule,
          TranslateModule.forRoot(),
          PipesModule,
        ],
        providers: [CurrencyPipe],
        declarations: [
          MiniBasketComponent,
          MockComponent({ selector: 'ish-product-image', template: 'Product Image Component', inputs: ['product'] }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.setTranslation('en', { 'shopping_cart.ministatus.items.text': { other: '#' } });
    product = {
      sku: 'sku',
      images: [
        {
          name: 'front S',
          type: 'Image',
          imageActualHeight: 110,
          imageActualWidth: 110,
          viewID: 'front',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'S',
          primaryImage: true,
        },
      ],
    } as Product;
    lineItem = {
      id: 'test',
      name: 'test',
      position: 1,
      quantity: {
        type: 'Quantity',
        value: 2,
        unit: '',
      },
      product: product,
      price: {
        type: 'Money',
        value: 27.76,
        currencyMnemonic: 'USD',
      },
      singleBasePrice: null,
      isHiddenGift: false,
      isFreeGift: false,
      inStock: false,
      variationProduct: false,
      bundleProduct: false,
      availability: false,
    };
    basket = {
      id: '4711',
      lineItems: [lineItem, lineItem, lineItem],
      purchaseCurrency: 'USD',
      totals: {
        itemTotal: {
          value: 0,
          currencyMnemonic: 'USD',
          type: 'Money',
        },
        basketTotal: {
          value: 0,
          currencyMnemonic: 'USD',
          type: 'Money',
        },
        taxTotal: {
          value: 0,
          currencyMnemonic: 'USD',
          type: 'Money',
        },
      },
    };

    component.basket = basket;
    component.currentProduct = 0;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render product rows if loaded', () => {
    fixture.detectChanges();
    expect(element.getElementsByClassName('product-row').length).toEqual(3);
  });

  it('should hold propper product count if loaded', () => {
    component.ngOnChanges();
    expect(component.itemCount).toBe(6);
  });

  it('should increment currentProduct index and disable scroll down button when clicking on scroll down button', () => {
    fixture.detectChanges();
    (element.getElementsByClassName('btn-scroll-down')[0] as HTMLDivElement).click();
    fixture.detectChanges();
    expect(component.currentProduct).toEqual(1);
    expect(element.getElementsByClassName('btn-scroll-down')[0].getAttribute('class')).toContain('disabled');
  });

  it('should decrement currentProduct index and disable scroll up button when clicking on scroll up button', () => {
    fixture.detectChanges();

    (element.getElementsByClassName('btn-scroll-down')[0] as HTMLDivElement).click();
    fixture.detectChanges();
    expect(component.currentProduct).toEqual(1);
    expect(element.getElementsByClassName('btn-scroll-up')[0].getAttribute('class')).not.toContain('disabled');

    (element.getElementsByClassName('btn-scroll-up')[0] as HTMLDivElement).click();
    fixture.detectChanges();
    expect(component.currentProduct).toEqual(0);
    expect(element.getElementsByClassName('btn-scroll-up')[0].getAttribute('class')).toContain('disabled');
  });

  it('should render product image component on component', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-image').length).toEqual(3);
  });

  it('should set isCollapsed to propper value if toggleCollapsed is called', () => {
    component.isCollapsed = true;
    component.toggleCollapse();
    expect(component.isCollapsed).toBeFalsy();
    component.toggleCollapse();
    expect(component.isCollapsed).toBeTruthy();
  });

  it('should set isCollapsed to true if collapse() is called', () => {
    component.collapse();
    expect(component.isCollapsed).toBeTruthy();
  });

  it('should set isCollapsed to false if open() is called', () => {
    component.open();
    expect(component.isCollapsed).toBeFalsy();
  });
});
