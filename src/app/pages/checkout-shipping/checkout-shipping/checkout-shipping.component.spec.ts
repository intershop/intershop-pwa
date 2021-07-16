import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
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
      declarations: [CheckoutShippingComponent, DummyWrapperComponent, MockPipe(PricePipe)],
      imports: [
        FormlyModule.forChild({
          wrappers: [{ name: 'shipping-radio-wrapper', component: DummyWrapperComponent }],
        }),
        FormlyTestingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutShippingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
    when(checkoutFacade.eligibleShippingMethods$()).thenReturn(of([BasketMockData.getShippingMethod()]));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render available shipping methods on page', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('formly-field')).toHaveLength(1);
  });

  it('should throw updateShippingMethod event when the user changes payment selection', () => {
    fixture.detectChanges();

    component.shippingForm.get('shippingMethod').setValue('testShipping');

    verify(checkoutFacade.updateBasketShippingMethod(anything())).once();
    const [arg] = capture(checkoutFacade.updateBasketShippingMethod).last();
    expect(arg).toMatchInlineSnapshot(`"testShipping"`);
  });
  it('should not disable next button if basket shipping method is set and next button is clicked', () => {
    expect(component.nextDisabled).toBeFalse();
    component.goToNextStep();
    expect(component.nextDisabled).toBeFalse();
  });

  it('should disable next button if basket shipping method is missing and next button is clicked', () => {
    when(checkoutFacade.basket$).thenReturn(of({ ...BasketMockData.getBasket(), commonShippingMethod: undefined }));

    component.goToNextStep();
    expect(component.nextDisabled).toBeTrue();
  });
});

@Component({ template: '<ng-template #fieldComponent></ng-template>' })
class DummyWrapperComponent extends FieldWrapper {}
