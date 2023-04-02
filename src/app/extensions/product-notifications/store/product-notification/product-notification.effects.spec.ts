import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import {
  ProductNotification,
  ProductNotificationType,
} from '../../models/product-notification/product-notification.model';
import { ProductNotificationsService } from '../../services/product-notifications/product-notifications.service';

import { productNotificationsActions, productNotificationsApiActions } from './product-notification.actions';
import { ProductNotificationEffects } from './product-notification.effects';

describe('Product Notification Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductNotificationEffects;
  let productNotificationsServiceMock: ProductNotificationsService;

  const productNotifications: ProductNotification[] = [
    {
      id: '12345_price',
      type: 'price',
      sku: '12345',
      notificationMailAddress: 'test@test.intershop.de',
      price: { type: 'Money', value: 75, currency: 'USD' },
    },
    {
      id: '67890_price',
      type: 'price',
      sku: '67890',
      notificationMailAddress: 'test@test.intershop.de',
      price: { type: 'Money', value: 15, currency: 'USD' },
    },
  ];

  const type: ProductNotificationType = 'price';
  const sku = '12345';
  const productNotificationId = '12345_price';

  beforeEach(() => {
    productNotificationsServiceMock = mock(ProductNotificationsService);
    when(productNotificationsServiceMock.getProductNotifications('price')).thenReturn(of(productNotifications));
    when(productNotificationsServiceMock.createProductNotification(anything())).thenReturn(of(productNotifications[0]));
    when(productNotificationsServiceMock.updateProductNotification(anything(), anything())).thenReturn(
      of(productNotifications[0])
    );
    when(productNotificationsServiceMock.deleteProductNotification(anything(), anything())).thenReturn(of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: ProductNotificationsService, useFactory: () => instance(productNotificationsServiceMock) },
        ProductNotificationEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(ProductNotificationEffects);
  });

  describe('loadProductNotification$', () => {
    it('should call the service for retrieving product notifications', done => {
      actions$ = of(productNotificationsActions.loadProductNotifications({ type: 'price' }));
      effects.loadProductNotifications$.subscribe(() => {
        verify(productNotificationsServiceMock.getProductNotifications('price')).once();
        done();
      });

      actions$ = of(productNotificationsActions.loadProductNotifications({ type: 'stock' }));
      effects.loadProductNotifications$.subscribe(() => {
        verify(productNotificationsServiceMock.getProductNotifications('stock')).once();
        done();
      });
    });

    it('should map to actions of type LoadProductNotificationsSuccess', () => {
      const action = productNotificationsActions.loadProductNotifications({ type: 'price' });
      const completion = productNotificationsApiActions.loadProductNotificationsSuccess({
        productNotifications,
        type,
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductNotifications$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type loadProductNotificationsFail', () => {
      when(productNotificationsServiceMock.getProductNotifications(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = productNotificationsActions.loadProductNotifications({ type: 'price' });
      const completion = productNotificationsApiActions.loadProductNotificationsFail({
        error: makeHttpError({ message: 'invalid' }),
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductNotifications$).toBeObservable(expected$);
    });
  });

  describe('createProductNotification$', () => {
    it('should call the service when createProductNotification event is called', done => {
      const action = productNotificationsActions.createProductNotification({
        productNotification: productNotifications[0],
      });
      actions$ = of(action);

      effects.createProductNotification$.subscribe(() => {
        verify(productNotificationsServiceMock.createProductNotification(productNotifications[0])).once();
        done();
      });
    });

    it('should map to actions of type createProductNotificationSuccess and displaySuccessMessage', () => {
      const action = productNotificationsActions.createProductNotification({
        productNotification: productNotifications[0],
      });
      const completion1 = productNotificationsApiActions.createProductNotificationSuccess({
        productNotification: productNotifications[0],
      });

      const completion2 = displaySuccessMessage({
        message: 'product.notification.create.success.message',
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.createProductNotification$).toBeObservable(expected$);
    });

    it('should dispatch a createProductNotificationFail action on failed', () => {
      const error = makeHttpError({ status: 401, code: 'error' });
      when(productNotificationsServiceMock.createProductNotification(productNotifications[0])).thenReturn(
        throwError(() => error)
      );

      const action = productNotificationsActions.createProductNotification({
        productNotification: productNotifications[0],
      });
      const completion = productNotificationsApiActions.createProductNotificationFail({
        error,
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createProductNotification$).toBeObservable(expected$);
    });
  });

  describe('updateProductNotification$', () => {
    it('should call the service when updateProductNotification event is called', done => {
      const action = productNotificationsActions.updateProductNotification({
        sku,
        productNotification: productNotifications[0],
      });
      actions$ = of(action);

      effects.updateProductNotification$.subscribe(() => {
        verify(productNotificationsServiceMock.updateProductNotification(sku, productNotifications[0])).once();
        done();
      });
    });

    it('should dispatch a updateProductNotification action on successful', () => {
      const action = productNotificationsActions.updateProductNotification({
        sku,
        productNotification: productNotifications[0],
      });
      const completion1 = productNotificationsApiActions.updateProductNotificationSuccess({
        productNotification: productNotifications[0],
      });

      const completion2 = displaySuccessMessage({
        message: 'product.notification.update.success.message',
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.updateProductNotification$).toBeObservable(expected$);
    });

    it('should dispatch a updateProductNotificationFail action on failed', () => {
      const error = makeHttpError({ status: 401, code: 'error' });
      when(productNotificationsServiceMock.updateProductNotification(sku, productNotifications[0])).thenReturn(
        throwError(() => error)
      );

      const action = productNotificationsActions.updateProductNotification({
        sku,
        productNotification: productNotifications[0],
      });
      const completion = productNotificationsApiActions.updateProductNotificationFail({
        error,
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateProductNotification$).toBeObservable(expected$);
    });
  });

  describe('deleteProductNotification$', () => {
    it('should call the service when deleteProductNotification event is called', done => {
      const productNotificationType: ProductNotificationType = 'price';

      const action = productNotificationsActions.deleteProductNotification({
        sku,
        productNotificationType,
        productNotificationId,
      });
      actions$ = of(action);

      effects.deleteProductNotification$.subscribe(() => {
        verify(productNotificationsServiceMock.deleteProductNotification(sku, type)).once();
        done();
      });
    });

    it('should dispatch a deleteProductNotification action on successful', () => {
      const productNotificationType: ProductNotificationType = 'price';

      const action = productNotificationsActions.deleteProductNotification({
        sku,
        productNotificationType,
        productNotificationId,
      });
      const completion1 = productNotificationsApiActions.deleteProductNotificationSuccess({ productNotificationId });

      const completion2 = displaySuccessMessage({
        message: 'product.notification.delete.success.message',
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.deleteProductNotification$).toBeObservable(expected$);
    });

    it('should dispatch a deleteProductNotificationFail action on failed', () => {
      const productNotificationType: ProductNotificationType = 'price';
      const error = makeHttpError({ status: 401, code: 'error' });
      when(productNotificationsServiceMock.deleteProductNotification(sku, type)).thenReturn(throwError(() => error));

      const action = productNotificationsActions.deleteProductNotification({
        sku,
        productNotificationType,
        productNotificationId,
      });
      const completion = productNotificationsApiActions.deleteProductNotificationFail({
        error,
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteProductNotification$).toBeObservable(expected$);
    });
  });

  describe('displayProductNotificationErrorMessage$', () => {
    it('should map to action of type displayProductNotificationErrorMessage in case of an error', () => {
      const error = makeHttpError({ status: 401, code: 'feld', message: 'e-message' });

      const action = productNotificationsApiActions.loadProductNotificationsFail({
        error,
      });
      const completion = displayErrorMessage({
        message: 'e-message',
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.displayProductNotificationErrorMessage$).toBeObservable(expected$);
    });
  });
});
