import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { SwiperComponent } from 'swiper/angular';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductsListComponent } from './products-list.component';

describe('Products List Component', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ProductItemComponent),
        MockComponent(SwiperComponent),
        MockDirective(ProductContextDirective),
        ProductsListComponent,
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(shoppingFacade.failedProducts$).thenReturn(of([]));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display a carousel when listStyle is set to carousel', () => {
    component.productSKUs = ['1', '2'];
    component.listStyle = 'carousel';
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`<div class="product-list"><swiper></swiper></div>`);
  });

  it('should set displayType of product item to listItemStyle value', () => {
    component.productSKUs = ['1', '2'];
    component.listItemStyle = 'tile';
    component.ngOnChanges();
    fixture.detectChanges();

    const productItem = fixture.debugElement.query(By.css('ish-product-item'))
      .componentInstance as ProductItemComponent;

    expect(productItem.displayType).toEqual('tile');
  });

  it('should display product items for all product skus', () => {
    component.productSKUs = ['1', '2', '3'];
    component.listItemStyle = 'row';
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelectorAll('ish-product-item')).toHaveLength(3);
    expect(element.querySelectorAll('ish-product-item')).toMatchInlineSnapshot(`
      NodeList [
        <ish-product-item
        ishproductcontext=""
        ng-reflect-sku="1"
        ng-reflect-display-type="row"
      ></ish-product-item>,
        <ish-product-item
        ishproductcontext=""
        ng-reflect-sku="2"
        ng-reflect-display-type="row"
      ></ish-product-item>,
        <ish-product-item
        ishproductcontext=""
        ng-reflect-sku="3"
        ng-reflect-display-type="row"
      ></ish-product-item>,
      ]
    `);
  });

  it('should display product items only for not failed product skus', () => {
    when(shoppingFacade.failedProducts$).thenReturn(of(['1']));
    component.productSKUs = ['1', '2', '3'];
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelectorAll('ish-product-item')).toHaveLength(2);
    expect(element.querySelectorAll('ish-product-item')).toMatchInlineSnapshot(`
      NodeList [
        <ish-product-item ishproductcontext="" ng-reflect-sku="2"></ish-product-item>,
        <ish-product-item ishproductcontext="" ng-reflect-sku="3"></ish-product-item>,
      ]
    `);
  });
});
