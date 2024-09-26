import { ChangeDetectionStrategy, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { FormlyForm } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { anything, capture, spy, verify } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketAddressSummaryComponent } from 'ish-shared/components/basket/basket-address-summary/basket-address-summary.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketErrorMessageComponent } from 'ish-shared/components/basket/basket-error-message/basket-error-message.component';
import { BasketItemsSummaryComponent } from 'ish-shared/components/basket/basket-items-summary/basket-items-summary.component';
import { BasketPaymentCostInfoComponent } from 'ish-shared/components/basket/basket-payment-cost-info/basket-payment-cost-info.component';
import { BasketPromotionCodeComponent } from 'ish-shared/components/basket/basket-promotion-code/basket-promotion-code.component';
import { BasketRecurrenceSummaryComponent } from 'ish-shared/components/basket/basket-recurrence-summary/basket-recurrence-summary.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoMessageComponent } from 'ish-shared/components/common/info-message/info-message.component';

import { PaymentSaveCheckboxComponent } from '../formly/payment-save-checkbox/payment-save-checkbox.component';
import { PaymentConcardisCreditcardComponent } from '../payment-concardis-creditcard/payment-concardis-creditcard.component';
import { PaymentParameterFormComponent } from '../payment-parameter-form/payment-parameter-form.component';

import { CheckoutPaymentComponent } from './checkout-payment.component';

describe('Checkout Payment Component', () => {
  let component: CheckoutPaymentComponent;
  let fixture: ComponentFixture<CheckoutPaymentComponent>;
  let element: HTMLElement;
  let paymentMethodChange: SimpleChanges;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutPaymentComponent,
        MockComponent(BasketAddressSummaryComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(BasketErrorMessageComponent),
        MockComponent(BasketItemsSummaryComponent),
        MockComponent(BasketPaymentCostInfoComponent),
        MockComponent(BasketPromotionCodeComponent),
        MockComponent(BasketRecurrenceSummaryComponent),
        MockComponent(BasketValidationResultsComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FormlyForm),
        MockComponent(InfoMessageComponent),
        MockComponent(PaymentConcardisCreditcardComponent),
        MockComponent(PaymentSaveCheckboxComponent),
        MockDirective(NgbCollapse),
        MockDirective(ServerHtmlDirective),
        MockPipe(PricePipe),
        PaymentParameterFormComponent,
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: 'checkout/review', children: [] }]),
        TranslateModule.forRoot(),
      ],
    })
      .overrideComponent(CheckoutPaymentComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPaymentComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
    component.paymentMethods = [
      {
        id: 'ISH_INVOICE',
        serviceId: 'ISH_INVOICE',
        displayName: 'Invoice',
        saveAllowed: false,
      },
      {
        id: 'Concardis_CreditCard',
        serviceId: 'Concardis_CreditCard',
        displayName: 'Concardis Credit Card',
        saveAllowed: false,
        parameters: [{ key: 'key1', name: 'name' }],
      },
      {
        id: 'ISH_CreditCard',
        serviceId: 'ISH_CreditCard',
        displayName: 'Intershop Credit Card',
        saveAllowed: true,
        parameters: [{ key: 'key1', name: 'name' }],
      },
      BasketMockData.getPaymentMethod(),
    ];
    paymentMethodChange = {
      paymentMethods: new SimpleChange(undefined, component.paymentMethods, false),
    };

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render available payment methods on page', () => {
    component.ngOnChanges(paymentMethodChange);
    fixture.detectChanges();
    expect(element.querySelector('#payment-accordion')).toBeTruthy();
  });

  it('should throw updatePaymentMethod event when the user changes payment selection', () => {
    fixture.detectChanges();

    const emitter = spy(component.updatePaymentMethod);

    component.paymentForm.get('name').setValue('testPayment');

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`"testPayment"`);
  });

  it('should display an info message if the basket total is 0', () => {
    component.basket.totals.total.net = 0;
    fixture.detectChanges();

    expect(element.querySelector('ish-info-message')).toBeTruthy();
  });

  describe('error display', () => {
    it('should not render an error if no error occurs', () => {
      fixture.detectChanges();
      expect(element.querySelector('[role="alert"]')).toBeFalsy();
    });

    it('should render an error if an error occurs', () => {
      component.error = makeHttpError({ status: 404 });
      fixture.detectChanges();
      expect(element.querySelector('ish-error-message')).toBeTruthy();
    });

    it('should not render an error if the user has currently no payment method selected', () => {
      component.basket.payment = undefined;
      fixture.detectChanges();
      expect(element.querySelector('[role="alert"]')).toBeFalsy();
    });

    it('should disable continue button if the user clicks next and has currently no payment method selected', () => {
      component.basket.payment = undefined;
      component.goToNextStep();
      fixture.detectChanges();
      expect(element.querySelector('button').hasAttribute('disabled')).toBeTruthy();
    });
  });

  describe('next button', () => {
    it('should set submitted if next button is clicked', () => {
      expect(component.nextSubmitted).toBeFalsy();
      component.goToNextStep();
      expect(component.nextSubmitted).toBeTruthy();
    });

    it('should not disable next button if basket payment method is set and next button is clicked', () => {
      expect(component.nextDisabled).toBeFalsy();
      component.goToNextStep();
      expect(component.nextDisabled).toBeFalsy();
    });

    it('should disable next button if basket payment method is missing and next button is clicked', () => {
      component.basket.payment = undefined;

      component.goToNextStep();
      expect(component.nextDisabled).toBeTruthy();
    });
  });

  describe('parameter forms', () => {
    it('should open and close payment form if open/cancel form is triggered', () => {
      component.basket.payment = undefined;
      expect(component.formIsOpen(-1)).toBeTruthy();
      component.openPaymentParameterForm(2);
      expect(component.formIsOpen(2)).toBeTruthy();

      component.cancelNewPaymentInstrument();
      expect(component.formIsOpen(-1)).toBeTruthy();
    });

    it('should throw createPaymentInstrument event when the user submits a valid parameter form and saving is not allowed', () => {
      component.basket.payment = undefined;
      component.ngOnChanges(paymentMethodChange);
      component.openPaymentParameterForm(1);

      const emitter = spy(component.createPaymentInstrument);

      component.parameterForm.addControl('creditCardNumber', new FormControl('123', Validators.required));
      component.submitParameterForm();

      verify(emitter.emit(anything())).once();
      const [arg] = capture(emitter.emit).last();
      expect(arg).toMatchInlineSnapshot(`
        {
          "paymentInstrument": {
            "id": undefined,
            "parameters": [
              {
                "name": "creditCardNumber",
                "value": "123",
              },
            ],
            "paymentMethod": "Concardis_CreditCard",
          },
          "saveForLater": false,
        }
      `);
    });

    it('should throw createUserPaymentInstrument event when the user submits a valid parameter form and saving is allowed', () => {
      component.basket.payment = undefined;

      component.ngOnChanges(paymentMethodChange);
      component.openPaymentParameterForm(3);

      const emitter = spy(component.createPaymentInstrument);

      component.paymentForm.addControl('saveForLater', new FormControl(true));
      component.parameterForm.addControl('creditCardNumber', new FormControl('456', Validators.required));
      component.submitParameterForm();

      verify(emitter.emit(anything())).once();
      const [arg] = capture(emitter.emit).last();
      expect(arg).toMatchInlineSnapshot(`
        {
          "paymentInstrument": {
            "id": undefined,
            "parameters": [
              {
                "name": "creditCardNumber",
                "value": "456",
              },
            ],
            "paymentMethod": "ISH_CreditCard",
          },
          "saveForLater": true,
        }
      `);
    });

    it('should disable submit button when the user submits an invalid parameter form', () => {
      component.basket.payment = undefined;
      component.openPaymentParameterForm(1);
      fixture.detectChanges();

      expect(component.formSubmitted).toBeFalsy();
      component.parameterForm.addControl('IBAN', new FormControl('', Validators.required));
      component.submitParameterForm();
      expect(component.formSubmitted).toBeTruthy();
    });

    it('should render standard parameter form for standard parametrized form', () => {
      component.basket.payment = undefined;
      component.openPaymentParameterForm(1);

      component.ngOnChanges(paymentMethodChange);
      fixture.detectChanges();
      expect(element.querySelector('formly-form')).toBeTruthy();
    });
  });

  describe('should display selectable and deleteable payment instruments for parametrized payment methods', () => {
    it('should display payment instruments when parametrized payment methods are available', () => {
      component.ngOnChanges(paymentMethodChange);
      fixture.detectChanges();

      expect(element.querySelector('[data-testing-id=payment-parameter-form-ISH_CreditCard]')).toBeTruthy();
      expect(
        element.querySelector('[data-testing-id=payment-parameter-form-ISH_CreditCard] input[type=radio]')
      ).toBeTruthy();
      expect(element.querySelector('[data-testing-id=payment-parameter-form-ISH_CreditCard] button')).toBeTruthy();
    });

    it('should throw deletePaymentInstrument event when the user deletes a payment instrument', () => {
      const paymentInstrument = {
        id: '4321',
        paymentMethod: 'ISH_DirectDebit',
        parameters: [
          {
            name: 'accountHolder',
            value: 'Patricia Miller',
          },
          {
            name: 'IBAN',
            value: 'DE430859340859340',
          },
        ],
      };
      fixture.detectChanges();

      const emitter = spy(component.deletePaymentInstrument);

      component.deleteBasketPayment(paymentInstrument);

      verify(emitter.emit(anything())).once();
      const [arg] = capture(emitter.emit).last();
      expect(arg?.id).toMatchInlineSnapshot(`"4321"`);
    });
  });
});
