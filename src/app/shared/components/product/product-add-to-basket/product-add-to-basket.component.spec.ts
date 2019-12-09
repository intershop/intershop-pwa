import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { combineReducers } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { ToastrModule } from 'ngx-toastr';

import { Product } from 'ish-core/models/product/product.model';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ProductAddToBasketComponent } from './product-add-to-basket.component';

describe('Product Add To Basket Component', () => {
  let component: ProductAddToBasketComponent;
  let fixture: ComponentFixture<ProductAddToBasketComponent>;
  let product: Product;
  let translate: TranslateService;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            checkout: combineReducers(checkoutReducers),
          },
        }),
      ],
      declarations: [MockComponent(FaIconComponent), ProductAddToBasketComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToBasketComponent);
    component = fixture.componentInstance;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    product = {
      sku: 'sku',
      salePrice: {
        value: 123.45,
        currency: '$',
      },
    } as Product;
    product.inStock = true;
    product.minOrderQuantity = 1;
    product.availability = true;
    element = fixture.nativeElement;
    component.product = product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter product is not set', () => {
    component.product = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should not render when inStock = false', () => {
    product.inStock = false;
    fixture.detectChanges();
    expect(element.querySelector('button')).toBeFalsy();
  });

  it('should show button when display type is not icon ', () => {
    fixture.detectChanges();
    expect(element.querySelector('button').className).toContain('btn-primary');
  });

  it('should show icon button when display type is icon ', () => {
    component.displayType = 'icon';
    fixture.detectChanges();
    expect(element.querySelector('fa-icon')).toBeTruthy();
  });

  it('should show disable button when "disabled" is set to "false" ', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(element.querySelector('button').disabled).toBeTruthy();
  });

  it('should use default translation when nothing is configured', () => {
    fixture.detectChanges();
    expect(element.textContent).toMatchInlineSnapshot(`"product.add_to_cart.link"`);
  });

  it('should use configured translation when it is configured', () => {
    component.translationKey = 'abc';
    fixture.detectChanges();
    expect(element.textContent).toMatchInlineSnapshot(`"abc"`);
  });
});
