import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { ProductAddToBasketComponent } from './product-add-to-basket.component';

describe('Product Add To Basket Component', () => {
  let component: ProductAddToBasketComponent;
  let fixture: ComponentFixture<ProductAddToBasketComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basketLoading$).thenReturn(of(false));

    context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'addToBasket')).thenReturn(of(true));
    when(context.select('product')).thenReturn(of({} as ProductView));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), ProductAddToBasketComponent],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render when display is false', () => {
    when(context.select('displayProperties', 'addToBasket')).thenReturn(of(false));
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

  it('should show disabled button when add to cart is not possible', () => {
    when(context.select('hasQuantityError')).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('button').disabled).toBeTruthy();
  });

  it('should use default translation when nothing is configured', () => {
    fixture.detectChanges();
    expect(element.textContent).toMatchInlineSnapshot(`"product.add_to_cart.link"`);
  });

  it('should use retail set translation when product is retail set', () => {
    when(context.select('product')).thenReturn(of({ type: 'RetailSet' } as ProductView));
    fixture.detectChanges();
    expect(element.textContent).toMatchInlineSnapshot(`"product.add_to_cart.retailset.link"`);
  });
});
