import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent, MockDirective } from 'ng-mocks';
import { SwiperComponent } from 'swiper/angular';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductsListComponent } from './products-list.component';

describe('Products List Component', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ProductItemComponent),
        MockComponent(SwiperComponent),
        MockDirective(ProductContextDirective),
        ProductsListComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('carousel', () => {
    beforeEach(() => {
      component.productSKUs = ['1', '2'];
    });

    it('should display a carousel when listStyle is set to carousel', () => {
      component.listStyle = 'carousel';

      fixture.detectChanges();

      expect(element).toMatchInlineSnapshot(`<div class="product-list"><swiper></swiper></div>`);
    });
  });

  it('should set displayType of product item to listItemStyle value', () => {
    component.productSKUs = ['1', '2'];
    component.listItemStyle = 'tile';

    fixture.detectChanges();

    const productItem = fixture.debugElement.query(By.css('ish-product-item'))
      .componentInstance as ProductItemComponent;

    expect(productItem.displayType).toEqual('tile');
  });

  it('should display product items for all product skus', () => {
    component.productSKUs = ['1', '2', '3'];
    component.listItemStyle = 'row';

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
});
