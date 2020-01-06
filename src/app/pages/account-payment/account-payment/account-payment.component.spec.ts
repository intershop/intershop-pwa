import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { AccountPaymentComponent } from './account-payment.component';

describe('Account Payment Component', () => {
  let component: AccountPaymentComponent;
  let fixture: ComponentFixture<AccountPaymentComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AccountPaymentComponent, MockComponent(ErrorMessageComponent), MockComponent(FaIconComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPaymentComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.paymentMethods = [
      {
        id: 'ISH_INVOICE',
        serviceId: 'ISH_INVOICE',
        displayName: 'Invoice',
        paymentInstruments: [{ id: '123' }],
      },
      {
        id: 'Concardis_CreditCard',
        serviceId: 'Concardis_CreditCard',
        displayName: 'Concardis Credit Card',
        paymentInstruments: [{ id: '456', accountIdentifier: '**************1111' }],
      },
      BasketMockData.getPaymentMethod(),
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('payment method display', () => {
    it('should render available payment methods on page', () => {
      fixture.detectChanges();
      expect(element.querySelector('[data-testing-id="paymentMethodList"]')).toBeTruthy();
      expect(element.querySelector('[data-testing-id="emptyMessage"]')).toBeFalsy();
    });

    it('should render empty message if no payment methods are available', () => {
      component.paymentMethods = undefined;
      fixture.detectChanges();
      expect(element.querySelector('[data-testing-id="paymentMethodList"]')).toBeFalsy();
      expect(element.querySelector('[data-testing-id="emptyMessage"]')).toBeTruthy();
    });
  });

  describe('error display', () => {
    it('should not render an error if no error occurs', () => {
      fixture.detectChanges();
      expect(element.querySelector('[role="alert"]')).toBeFalsy();
    });

    it('should render an error if an error occurs', () => {
      component.error = { status: 404 } as HttpError;
      fixture.detectChanges();
      expect(element.querySelector('ish-error-message')).toBeTruthy();
    });
  });

  describe('delete payment instrument', () => {
    it('should throw deletePaymentInstrument event when the user deletes a payment instrument', done => {
      const id = 'paymentInstrumentId';

      fixture.detectChanges();

      component.deletePaymentInstrument.subscribe(paymentInstrumentId => {
        expect(paymentInstrumentId).toEqual(id);
        done();
      });
      component.deleteUserPayment(id);
    });
  });
});
