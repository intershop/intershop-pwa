import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { User } from 'ish-core/models/user/user.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
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
        paymentInstruments: [{ id: '123', paymentMethod: 'ISH_INVOICE' }],
      },
      {
        id: 'Concardis_CreditCard',
        serviceId: 'Concardis_CreditCard',
        displayName: 'Concardis Credit Card',
        paymentInstruments: [
          { id: '456', paymentMethod: 'Concardis_CreditCard', accountIdentifier: '**************1111' },
        ],
      },
      BasketMockData.getPaymentMethod(),
    ];
    component.user = {
      firstName: 'Paticia',
      lastName: 'Miller',
      preferredPaymentInstrumentId: '123',
    } as User;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('payment method display', () => {
    it('should render available payment methods on page', () => {
      component.ngOnChanges();
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

  describe('preferred payment method', () => {
    it('should render a preferred payment instrument if there is one', () => {
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('[data-testing-id="preferred-payment-instrument"]')).toBeTruthy();
    });

    it('should not render a preferred payment instrument if there is no prefered instrument at user', () => {
      component.user.preferredPaymentInstrumentId = undefined;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('[data-testing-id="preferred-payment-instrument"]')).toBeFalsy();
    });
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

  describe('update default payment instrument', () => {
    it('should throw updateDefaultPaymentInstrument event when the user changes his preferred payment instrument', done => {
      const id = 'paymentInstrumentId';
      component.user = { firstName: 'Patricia', lastName: 'Miller' } as User;

      fixture.detectChanges();

      component.updateDefaultPaymentInstrument.subscribe(user => {
        expect(user.preferredPaymentInstrumentId).toBe(id);
        done();
      });
      component.setAsDefaultPayment(id);
    });
  });
});
