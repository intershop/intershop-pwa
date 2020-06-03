import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Payment } from 'ish-core/models/payment/payment.model';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { AccountStoreModule } from 'ish-core/store/account/account-store.module';
import { LoginUserSuccess } from 'ish-core/store/account/user';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { BasketPaymentEffects } from './basket-payment.effects';
import {
  CreateBasketPayment,
  CreateBasketPaymentFail,
  CreateBasketPaymentSuccess,
  DeleteBasketPayment,
  DeleteBasketPaymentFail,
  DeleteBasketPaymentSuccess,
  LoadBasket,
  LoadBasketEligiblePaymentMethods,
  LoadBasketEligiblePaymentMethodsFail,
  LoadBasketEligiblePaymentMethodsSuccess,
  LoadBasketSuccess,
  SetBasketPayment,
  SetBasketPaymentFail,
  SetBasketPaymentSuccess,
  UpdateBasketPayment,
  UpdateBasketPaymentFail,
  UpdateBasketPaymentSuccess,
} from './basket.actions';

describe('Basket Payment Effects', () => {
  let actions$: Observable<Action>;
  let paymentServiceMock: PaymentService;
  let effects: BasketPaymentEffects;
  let store$: Store;
  let router: Router;

  beforeEach(() => {
    paymentServiceMock = mock(PaymentService);

    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        AccountStoreModule.forTesting('user', 'basket'),
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([{ path: 'checkout/review', component: DummyComponent }]),
        ShoppingStoreModule.forTesting('products', 'categories'),
      ],
      providers: [
        BasketPaymentEffects,
        provideMockActions(() => actions$),
        { provide: PaymentService, useFactory: () => instance(paymentServiceMock) },
      ],
    });

    effects = TestBed.inject(BasketPaymentEffects);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  describe('loadBasketEligiblePaymentMethods$', () => {
    beforeEach(() => {
      when(paymentServiceMock.getBasketEligiblePaymentMethods(anyString())).thenReturn(
        of([BasketMockData.getPaymentMethod()])
      );

      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the paymentService for loadBasketEligiblePaymentMethods', done => {
      const action = new LoadBasketEligiblePaymentMethods();
      actions$ = of(action);

      effects.loadBasketEligiblePaymentMethods$.subscribe(() => {
        verify(paymentServiceMock.getBasketEligiblePaymentMethods('BID')).once();
        done();
      });
    });

    it('should map to action of type loadBasketEligiblePaymentMethodsSuccess', () => {
      const action = new LoadBasketEligiblePaymentMethods();
      const completion = new LoadBasketEligiblePaymentMethodsSuccess({
        paymentMethods: [BasketMockData.getPaymentMethod()],
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethods$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketEligiblePaymentMethodsFail', () => {
      when(paymentServiceMock.getBasketEligiblePaymentMethods(anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new LoadBasketEligiblePaymentMethods();
      const completion = new LoadBasketEligiblePaymentMethodsFail({
        error: {
          message: 'invalid',
        } as HttpError,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethods$).toBeObservable(expected$);
    });
  });

  describe('setPaymentAtBasket$ - set payment at basket for the first time', () => {
    beforeEach(() => {
      when(paymentServiceMock.setBasketPayment(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(
        new LoadBasketSuccess({
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
      const action = new SetBasketPayment({ id });
      actions$ = of(action);

      effects.setPaymentAtBasket$.subscribe(() => {
        verify(paymentServiceMock.setBasketPayment('BID', id)).once();
        done();
      });
    });

    it('should map to action of type SetBasketPaymentSuccess', () => {
      const id = 'newPayment';
      const action = new SetBasketPayment({ id });
      const completion = new SetBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type SetPaymentFail', () => {
      when(paymentServiceMock.setBasketPayment(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new SetBasketPayment({ id: 'newPayment' });
      const completion = new SetBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });
  });

  describe('setPaymentAtBasket$ - change payment method at basket', () => {
    beforeEach(() => {
      when(paymentServiceMock.setBasketPayment(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(new LoadBasketSuccess({ basket: BasketMockData.getBasket() }));
    });

    it('should call the paymentService for setPaymentAtBasket', done => {
      const id = 'newPayment';
      const action = new SetBasketPayment({ id });
      actions$ = of(action);

      effects.setPaymentAtBasket$.subscribe(() => {
        verify(paymentServiceMock.setBasketPayment('4711', id)).once();
        done();
      });
    });

    it('should map to action of type SetBasketPaymentSuccess', () => {
      const id = 'newPayment';
      const action = new SetBasketPayment({ id });
      const completion = new SetBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid addBasketPayment request to action of type SetPaymentFail', () => {
      when(paymentServiceMock.setBasketPayment(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new SetBasketPayment({ id: 'newPayment' });
      const completion = new SetBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
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
    };
    const customer = { customerNo: 'patricia' } as Customer;

    beforeEach(() => {
      when(paymentServiceMock.createBasketPayment(anyString(), anything())).thenReturn(
        of({ id: 'newPaymentInstrumentId' } as PaymentInstrument)
      );
      when(paymentServiceMock.createUserPayment(anyString(), anything())).thenReturn(
        of({ id: 'newPaymentInstrumentId' } as PaymentInstrument)
      );

      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            payment: undefined,
          } as Basket,
        })
      );
      store$.dispatch(new LoginUserSuccess({ customer }));
    });

    it('should call the paymentService if payment instrument is saved at basket', done => {
      const action = new CreateBasketPayment({ paymentInstrument, saveForLater: false });
      actions$ = of(action);

      effects.createBasketPaymentInstrument$.subscribe(() => {
        verify(paymentServiceMock.createBasketPayment('BID', anything())).once();
        done();
      });
    });

    it('should call the paymentService if payment instrument is saved at user', done => {
      const action = new CreateBasketPayment({ paymentInstrument, saveForLater: true });
      actions$ = of(action);

      effects.createBasketPaymentInstrument$.subscribe(() => {
        verify(paymentServiceMock.createUserPayment(customer.customerNo, anything())).once();
        done();
      });
    });
    it('should map to action of type SetBasketPayment and CreateBasketPaymentSuccess', () => {
      const action = new CreateBasketPayment({ paymentInstrument, saveForLater: false });
      const completion1 = new SetBasketPayment({ id: 'newPaymentInstrumentId' });
      const completion2 = new CreateBasketPaymentSuccess();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.createBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type CreateBasketPaymentFail', () => {
      when(paymentServiceMock.createBasketPayment(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new CreateBasketPayment({ paymentInstrument, saveForLater: false });
      const completion = new CreateBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map to action of type LoadEligibleBasketMethod in case of success', () => {
      const action = new CreateBasketPaymentSuccess();
      const completion = new LoadBasketEligiblePaymentMethods();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethodsAfterChange$).toBeObservable(expected$);
    });
  });

  describe('sendPaymentRedirectData$', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should trigger updateBasketPayment action if checkout payment/review page is called with query param "redirect"', done => {
      router.navigate(['checkout', 'review'], { queryParams: { redirect: 'success', param1: 123 } });

      effects.sendPaymentRedirectData$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Basket] Update a Basket Payment with Redirect Data:
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
      when(paymentServiceMock.updateBasketPayment(anyString(), anything())).thenReturn(of(payment));

      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            payment: payment as Payment,
          } as Basket,
        })
      );
    });

    it('should call the paymentService for updateBasketPayment', done => {
      const action = new UpdateBasketPayment({ params });
      actions$ = of(action);

      effects.updateBasketPayment$.subscribe(() => {
        verify(paymentServiceMock.updateBasketPayment('BID', anything())).once();
        done();
      });
    });

    it('should map to action of type UpdateBasketPaymentSuccess', () => {
      const action = new UpdateBasketPayment({ params });
      const completion = new UpdateBasketPaymentSuccess();

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketPayment$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateBasketPaymentFail', () => {
      when(paymentServiceMock.updateBasketPayment(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new UpdateBasketPayment({ params });
      const completion = new UpdateBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketPayment$).toBeObservable(expected$);
    });

    it('should map to action of type LoadBasket in case of success', () => {
      const action = new UpdateBasketPaymentSuccess();
      const completion = new LoadBasket();
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

      store$.dispatch(
        new LoadBasketSuccess({
          basket,
        })
      );
    });

    it('should call the paymentService for deleteBasketPayment', done => {
      const action = new DeleteBasketPayment({ paymentInstrument });
      actions$ = of(action);

      effects.deleteBasketPaymentInstrument$.subscribe(() => {
        verify(paymentServiceMock.deleteBasketPaymentInstrument(anything(), anything())).once();
        done();
      });
    });

    it('should map to action of type DeleteBasketPaymentSuccess', () => {
      const action = new DeleteBasketPayment({ paymentInstrument });
      const completion = new DeleteBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteBasketPaymentFail', () => {
      when(paymentServiceMock.deleteBasketPaymentInstrument(anything(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new DeleteBasketPayment({ paymentInstrument });
      const completion = new DeleteBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map to action of type GetEligiblePaymentMethods in case of success', () => {
      const action = new DeleteBasketPaymentSuccess();
      const completion = new LoadBasketEligiblePaymentMethods();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethodsAfterChange$).toBeObservable(expected$);
    });

    it('should map to action of type LoadBasket in case of success', () => {
      const action = new DeleteBasketPaymentSuccess();
      const completion = new LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterBasketChangeSuccess$).toBeObservable(expected$);
    });
  });
});
