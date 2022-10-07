import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { CheckoutShippingComponent } from './checkout-shipping.component';

describe('Checkout Shipping Component', () => {
  let component: CheckoutShippingComponent;
  let fixture: ComponentFixture<CheckoutShippingComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    await TestBed.configureTestingModule({
      declarations: [CheckoutShippingComponent],
      imports: [
        FormlyModule.forChild({
          wrappers: [{ name: 'shipping-radio-wrapper', component: DummyWrapperComponent }],
        }),
        FormlyTestingModule,
      ],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutShippingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
    when(checkoutFacade.eligibleShippingMethodsNoFetch$).thenReturn(of([BasketMockData.getShippingMethod()]));
    when(checkoutFacade.getValidShippingMethod$()).thenReturn(of(BasketMockData.getBasket().commonShippingMethod.id));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render available shipping methods on page', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('formly-group formly-field')).toHaveLength(1);
  });

  it('should throw updateShippingMethod event when the user changes payment selection', () => {
    fixture.detectChanges();

    component.shippingForm.get('shippingMethod').setValue('testShipping');

    verify(checkoutFacade.updateBasketShippingMethod(anything())).twice();
    const [arg] = capture(checkoutFacade.updateBasketShippingMethod).last();
    expect(arg).toMatchInlineSnapshot(`"testShipping"`);
  });

  it('should update basket if current shippingMethod is invalid', () => {
    when(checkoutFacade.getValidShippingMethod$()).thenReturn(of('other'));
    fixture.detectChanges();
    verify(checkoutFacade.updateBasketShippingMethod(anything())).twice();
    const [arg] = capture(checkoutFacade.updateBasketShippingMethod).last();
    expect(arg).toMatchInlineSnapshot(`"other"`);
  });
});

@Component({ template: '<ng-template #fieldComponent></ng-template>' })
class DummyWrapperComponent extends FieldWrapper {}
