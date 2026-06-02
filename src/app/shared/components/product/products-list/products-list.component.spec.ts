import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent, MockDirective, MockInstance } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { LazyLoadingContentDirective } from 'ish-core/directives/lazy-loading-content.directive';
import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DeferredItemComponent } from 'ish-shared/components/common/deferred-item/deferred-item.component';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductsListComponent } from './products-list.component';

describe('Products List Component', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  MockInstance.scope();

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      imports: [ProductsListComponent],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    })
      .overrideComponent(ProductsListComponent, {
        remove: {
          imports: [ProductContextDirective, ProductItemComponent, DeferredItemComponent, LazyLoadingContentDirective],
        },
        add: {
          imports: [
            MockDirective(ProductContextDirective),
            MockComponent(ProductItemComponent),
            MockComponent(DeferredItemComponent),
            MockDirective(LazyLoadingContentDirective),
          ],
        },
      })
      .compileComponents();
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

    expect(element.querySelector('.swiper')).toBeTruthy();
    expect(element.querySelectorAll('.swiper-slide')).toHaveLength(2);
  });

  it('should render product items directly for server-side rendering', () => {
    component.productSKUs = ['1', '2'];
    component.listStyle = 'carousel';
    component.isServerSideRendering = true;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('swiper')).toBeFalsy();
    expect(element.querySelectorAll('ish-product-item')).toHaveLength(2);
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
        ng-reflect-display-type="row"
        ng-reflect-sku="1"
      ></ish-product-item>,
        <ish-product-item
        ishproductcontext=""
        ng-reflect-display-type="row"
        ng-reflect-sku="2"
      ></ish-product-item>,
        <ish-product-item
        ishproductcontext=""
        ng-reflect-display-type="row"
        ng-reflect-sku="3"
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
