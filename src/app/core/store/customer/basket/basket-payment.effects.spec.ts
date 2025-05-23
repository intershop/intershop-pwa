import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, noop, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { BasketValidation } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { Payment } from 'ish-core/models/payment/payment.model';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadServerConfigSuccess } from 'ish-core/store/core/server-config';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { routerTestNavigatedAction } from 'ish-core/utils/dev/routing';

import { BasketPaymentEffects } from './basket-payment.effects';
import {
  continueWithFastCheckout,
  createBasketPayment,
  createBasketPaymentFail,
  createBasketPaymentSuccess,
  deleteBasketPayment,
  deleteBasketPaymentFail,
  deleteBasketPaymentSuccess,
  loadBasket,
  loadBasketEligiblePaymentMethods,
  loadBasketEligiblePaymentMethodsFail,
  loadBasketEligiblePaymentMethodsSuccess,
  loadBasketSuccess,
  setBasketPayment,
  setBasketPaymentFail,
  setBasketPaymentSuccess,
  startRedirectBeforeCheckout,
  startRedirectBeforeCheckoutFail,
  updateBasketPayment,
  updateBasketPaymentFail,
  updateBasketPaymentSuccess,
} from './basket.actions';

describe('Basket Payment Effects', () => {
  let actions$: Observable<Action>;
  let paymentServiceMock: PaymentService;
  let effects: BasketPaymentEffects;
  let store: Store;

  beforeEach(() => {
    paymentServiceMock = mock(PaymentService);

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['configuration', 'serverConfig', 'router']),
        CustomerStoreModule.forTesting('user', 'basket'),
      ],
      providers: [
        { provide: PaymentService, useFactory: () => instance(paymentServiceMock) },
        BasketPaymentEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(BasketPaymentEffects);
    store = TestBed.inject(Store);
  });

  describe('loadBasketEligiblePaymentMethods$', () => {
    beforeEach(() => {
      when(paymentServiceMock.getBasketEligiblePaymentMethods()).thenReturn(of([BasketMockData.getPaymentMethod()]));

      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the paymentService for loadBasketEligiblePaymentMethods', done => {
      const action = loadBasketEligiblePaymentMethods();
      actions$ = of(action);

      effects.loadBasketEligiblePaymentMethods$.subscribe(() => {
        verify(paymentServiceMock.getBasketEligiblePaymentMethods()).once();
        done();
      });
    });

    it('should map to action of type loadBasketEligiblePaymentMethodsSuccess', () => {
      const action = loadBasketEligiblePaymentMethods();
      const completion = loadBasketEligiblePaymentMethodsSuccess({
        paymentMethods: [BasketMockData.getPaymentMethod()],
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethods$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketEligiblePaymentMethodsFail', () => {
      when(paymentServiceMock.getBasketEligiblePaymentMethods()).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = loadBasketEligiblePaymentMethods();
      const completion = loadBasketEligiblePaymentMethodsFail({
        error: makeHttpError({ message: 'invalid' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethods$).toBeObservable(expected$);
    });
  });

  describe('setPaymentAtBasket$ - set payment at basket for the first time', () => {
    beforeEach(() => {
      when(paymentServiceMock.setBasketPayment(anyString())).thenReturn(of(undefined));

      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            payment: undefined,
          } as Basket,
        })
      );
    });

    it('should call the paymentService for setPaymentAtBasket', done => {
      const id = 'newPayment';
      const action = setBasketPayment({ id });
      actions$ = of(action);

      effects.setPaymentAtBasket$.subscribe(() => {
        verify(paymentServiceMock.setBasketPayment(id)).once();
        done();
      });
    });

    it('should map to action of type SetBasketPaymentSuccess', () => {
      const id = 'newPayment';
      const action = setBasketPayment({ id });
      const completion = setBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type SetPaymentFail', () => {
      when(paymentServiceMock.setBasketPayment(anyString())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = setBasketPayment({ id: 'newPayment' });
      const completion = setBasketPaymentFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });
  });

  describe('setPaymentAtBasket$ - change payment method at basket', () => {
    beforeEach(() => {
      when(paymentServiceMock.setBasketPayment(anyString())).thenReturn(of(undefined));

      store.dispatch(loadBasketSuccess({ basket: BasketMockData.getBasket() }));
    });

    it('should call the paymentService for setPaymentAtBasket', done => {
      const id = 'newPayment';
      const action = setBasketPayment({ id });
      actions$ = of(action);

      effects.setPaymentAtBasket$.subscribe(() => {
        verify(paymentServiceMock.setBasketPayment(id)).once();
        done();
      });
    });

    it('should map to action of type SetBasketPaymentSuccess', () => {
      const id = 'newPayment';
      const action = setBasketPayment({ id });
      const completion = setBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid addBasketPayment request to action of type SetPaymentFail', () => {
      when(paymentServiceMock.setBasketPayment(anyString())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = setBasketPayment({ id: 'newPayment' });
      const completion = setBasketPaymentFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });
  });

  describe('startRedirectBeforeCheckout$ - continue with redirect', () => {
    const paymentMethodId = 'MethodId123';
    beforeEach(() => {
      // mock location.assign() with jest.fn()
      Object.defineProperty(window, 'location', {
        value: { assign: jest.fn() },
        writable: true,
      });

      when(paymentServiceMock.sendRedirectUrls(anything())).thenReturn(
        of({ redirect: { redirectUrl: 'redirectUrl' } } as PaymentData)
      );
      store.dispatch(
        loadServerConfigSuccess({
          config: {
            general: {
              defaultLocale: 'de_DE',
              defaultCurrency: 'EUR',
              locales: ['en_US', 'de_DE', 'fr_BE', 'nl_BE'],
              currencies: ['USD', 'EUR'],
            },
          },
        })
      );

      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            payment: {
              paymentInstrument: { id: paymentMethodId } as PaymentInstrument,
              redirectRequired: true,
            } as Payment,
          } as Basket,
        })
      );
    });

    it('should call the paymentService for startRedirectBeforeCheckout', done => {
      when(paymentServiceMock.sendRedirectUrls(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = startRedirectBeforeCheckout();
      actions$ = of(action);

      effects.startRedirectBeforeCheckout$.subscribe(() => {
        verify(paymentServiceMock.sendRedirectUrls(paymentMethodId)).once();
        done();
      });
    });

    it('should start redirect in case of successful sending the redirect urls', fakeAsync(() => {
      const action = startRedirectBeforeCheckout();
      actions$ = of(action);

      effects.startRedirectBeforeCheckout$.subscribe({ next: noop, error: fail, complete: noop });

      tick(500);

      expect(window.location.assign).toHaveBeenCalled();
    }));
    it('should map to action of type startRedirectBeforeCheckoutFail in case of failure', () => {
      when(paymentServiceMock.sendRedirectUrls(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = startRedirectBeforeCheckout();
      const completion = startRedirectBeforeCheckoutFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.startRedirectBeforeCheckout$).toBeObservable(expected$);
    });
  });

  describe('createBasketPaymentInstrument$', () => {
    const paymentInstrument = {
      id: undefined,
      paymentMethod: 'ISH_DirectDebit',
      parameters_: [
        {
          name: 'accountHolder',
          value: 'Patricia Miller',
        },
        {
          name: 'IBAN',
          value: 'DE430859340859340',
        },
      ],
    } as PaymentInstrument;
    const customer = { customerNo: 'patricia' } as Customer;

    beforeEach(() => {
      when(paymentServiceMock.createBasketPayment(anything())).thenReturn(
        of({ id: 'newPaymentInstrumentId' } as PaymentInstrument)
      );
      when(paymentServiceMock.createUserPayment(anyString(), anything())).thenReturn(
        of({ id: 'newPaymentInstrumentId' } as PaymentInstrument)
      );

      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            payment: undefined,
          } as Basket,
        })
      );
      store.dispatch(loginUserSuccess({ customer }));
    });

    it('should call the paymentService if payment instrument is saved at basket', done => {
      const action = createBasketPayment({ paymentInstrument, saveForLater: false });
      actions$ = of(action);

      effects.createBasketPaymentInstrument$.subscribe(() => {
        verify(paymentServiceMock.createBasketPayment(anything())).once();
        done();
      });
    });

    it('should call the paymentService if payment instrument is saved at user', done => {
      const action = createBasketPayment({ paymentInstrument, saveForLater: true });
      actions$ = of(action);

      effects.createBasketPaymentInstrument$.subscribe(() => {
        verify(paymentServiceMock.createUserPayment(customer.customerNo, anything())).once();
        done();
      });
    });
    it('should map to action of type SetBasketPayment and CreateBasketPaymentSuccess', () => {
      const action = createBasketPayment({ paymentInstrument, saveForLater: false });
      const completion1 = setBasketPayment({ id: 'newPaymentInstrumentId' });
      const completion2 = createBasketPaymentSuccess();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.createBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type CreateBasketPaymentFail', () => {
      when(paymentServiceMock.createBasketPayment(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = createBasketPayment({ paymentInstrument, saveForLater: false });
      const completion = createBasketPaymentFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map to action of type LoadEligibleBasketMethod in case of success', () => {
      const action = createBasketPaymentSuccess();
      const completion = loadBasketEligiblePaymentMethods();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethodsAfterChange$).toBeObservable(expected$);
    });
  });

  describe('sendPaymentRedirectData$', () => {
    beforeEach(() => {
      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should trigger updateBasketPayment action if checkout payment/review page is called with query param "redirect"', done => {
      actions$ = of(
        routerTestNavigatedAction({
          routerState: { url: '/checkout/review', queryParams: { redirect: 'success', param1: '123' } },
        })
      );

      effects.sendPaymentRedirectData$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Basket Internal] Update a Basket Payment with Redirect Data:
            params: {"redirect":"success","param1":"123"}
        `);
        done();
      });
    });
  });

  describe('updateBasketPayment$', () => {
    const paymentInstrument = {
      id: '456',
      paymentMethod: 'ISH_DirectDebit',
      parameters_: [
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

    const params = {
      redirect: 'success',
      param1: '123',
      param2: '456',
    };

    const payment = {
      id: '123',
      paymentInstrument,
      paymentMethod: { id: 'ISH_DirectDebit' } as PaymentMethod,
      redirectRequired: false,
    };

    beforeEach(() => {
      when(paymentServiceMock.updateBasketPayment(anything())).thenReturn(of(payment));

      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            payment: payment as Payment,
          } as Basket,
        })
      );
    });

    it('should call the paymentService for updateBasketPayment', done => {
      const action = updateBasketPayment({ params });
      actions$ = of(action);

      effects.updateBasketPayment$.subscribe(() => {
        verify(paymentServiceMock.updateBasketPayment(anything())).once();
        done();
      });
    });

    it('should map to action of type UpdateBasketPaymentSuccess', () => {
      const action = updateBasketPayment({ params });
      const completion = updateBasketPaymentSuccess();

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketPayment$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateBasketPaymentFail', () => {
      when(paymentServiceMock.updateBasketPayment(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = updateBasketPayment({ params });
      const completion = updateBasketPaymentFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketPayment$).toBeObservable(expected$);
    });

    it('should map to action of type LoadBasket in case of success', () => {
      const action = updateBasketPaymentSuccess();
      const completion = loadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterBasketChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('deleteBasketPaymentInstrument$', () => {
    const paymentInstrument = {
      id: '12345',
      paymentMethod: 'ISH_DirectDebit',
      parameters_: [
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

    const basket = {
      id: 'BID',
      lineItems: [],
      payment: undefined,
    } as Basket;
    beforeEach(() => {
      when(paymentServiceMock.deleteBasketPaymentInstrument(anything(), anything())).thenReturn(of(undefined));

      store.dispatch(
        loadBasketSuccess({
          basket,
        })
      );
    });

    it('should call the paymentService for deleteBasketPayment', done => {
      const action = deleteBasketPayment({ paymentInstrument });
      actions$ = of(action);

      effects.deleteBasketPaymentInstrument$.subscribe(() => {
        verify(paymentServiceMock.deleteBasketPaymentInstrument(anything(), anything())).once();
        done();
      });
    });

    it('should map to action of type DeleteBasketPaymentSuccess', () => {
      const action = deleteBasketPayment({ paymentInstrument });
      const completion = deleteBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteBasketPaymentFail', () => {
      when(paymentServiceMock.deleteBasketPaymentInstrument(anything(), anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = deleteBasketPayment({ paymentInstrument });
      const completion = deleteBasketPaymentFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map to action of type GetEligiblePaymentMethods in case of success', () => {
      const action = deleteBasketPaymentSuccess();
      const completion = loadBasketEligiblePaymentMethods();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethodsAfterChange$).toBeObservable(expected$);
    });

    it('should map to action of type LoadBasket in case of success', () => {
      const action = deleteBasketPaymentSuccess();
      const completion = loadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterBasketChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('continueWithFastCheckout$ - continue with redirect', () => {
    const basketValidation: BasketValidation = {
      basket: BasketMockData.getBasket(),
      results: {
        valid: true,
        adjusted: false,
      },
    };

    beforeEach(() => {
      when(paymentServiceMock.setBasketFastCheckoutPayment(anyString())).thenReturn(of(undefined));
      store.dispatch(
        loadServerConfigSuccess({
          config: {
            general: {
              defaultLocale: 'de_DE',
              defaultCurrency: 'EUR',
              locales: ['en_US', 'de_DE', 'fr_BE', 'nl_BE'],
              currencies: ['USD', 'EUR'],
            },
          },
        })
      );
    });

    it('should start redirect in case of successful payment instrument assignment', fakeAsync(() => {
      // mock location.assign() with jest.fn()
      Object.defineProperty(window, 'location', {
        value: { assign: jest.fn() },
        writable: true,
      });

      const action = continueWithFastCheckout({
        targetRoute: undefined,
        basketValidation,
        paymentId: 'FastCheckout',
      });
      actions$ = of(action);

      effects.continueWithFastCheckout$.subscribe({ next: noop, error: fail, complete: noop });

      tick(500);

      expect(window.location.assign).toHaveBeenCalled();
    }));
    it('should map to action of type setBasketPaymentFail in case of failure', () => {
      when(paymentServiceMock.setBasketFastCheckoutPayment(anyString())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = continueWithFastCheckout({
        targetRoute: undefined,
        basketValidation,
        paymentId: 'FastCheckout',
      });
      const completion = setBasketPaymentFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.continueWithFastCheckout$).toBeObservable(expected$);
    });
  });
});
