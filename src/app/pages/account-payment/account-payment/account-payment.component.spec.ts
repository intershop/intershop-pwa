import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, verify } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { AccountPaymentConcardisDirectdebitComponent } from '../account-payment-concardis-directdebit/account-payment-concardis-directdebit.component';

import { AccountPaymentComponent } from './account-payment.component';

describe('Account Payment Component', () => {
  let component: AccountPaymentComponent;
  let fixture: ComponentFixture<AccountPaymentComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [AccountPaymentComponent, MockComponent(AccountPaymentConcardisDirectdebitComponent)],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

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
      preferredPaymentInstrumentId: '456',
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

      expect(component.preferredPaymentInstrument.id).toEqual(component.user.preferredPaymentInstrumentId);
      expect(element.querySelector('[data-testing-id="preferred-payment-instrument"]')).toBeTruthy();
    });

    it('should not render a preferred payment instrument if there is no prefered instrument at user', () => {
      component.user.preferredPaymentInstrumentId = undefined;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('[data-testing-id="preferred-payment-instrument"]')).toBeFalsy();
    });
  });

  describe('delete payment instrument', () => {
    it('should call deletePaymentInstrument event the user deletes a payment instrument', () => {
      fixture.detectChanges();

      component.deleteUserPayment('paymentInstrumentId');

      verify(accountFacade.deletePaymentInstrument('paymentInstrumentId', anything())).once();
    });
  });

  describe('update default payment instrument', () => {
    it('should call updateDefaultPaymentInstrument when the user changes his preferred payment instrument', () => {
      component.user = { firstName: 'Patricia', lastName: 'Miller' } as User;

      fixture.detectChanges();

      component.setAsDefaultPayment('paymentInstrumentId');
      verify(accountFacade.updateUserPreferredPaymentInstrument(anything(), anything(), anything())).once();
    });
  });
});
