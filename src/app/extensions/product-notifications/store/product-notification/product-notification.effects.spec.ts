import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ProductNotification } from '../../models/product-notification/product-notification.model';
import { ProductNotificationsService } from '../../services/product-notifications/product-notifications.service';

import {
  loadProductNotifications,
  loadProductNotificationsFail,
  loadProductNotificationsSuccess,
} from './product-notification.actions';
import { ProductNotificationEffects } from './product-notification.effects';

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

describe('Product Notification Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductNotificationEffects;
  let productNotificationsServiceMock: ProductNotificationsService;

  beforeEach(() => {
    productNotificationsServiceMock = mock(ProductNotificationsService);
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
    beforeEach(() => {
      when(productNotificationsServiceMock.getProductNotifications('price')).thenReturn(of(productNotifications));
    });

    it('should call the service for retrieving product notifications', done => {
      actions$ = of(loadProductNotifications({ type: 'price' }));
      effects.loadProductNotifications$.subscribe(() => {
        verify(productNotificationsServiceMock.getProductNotifications('price')).once();
        done();
      });

      actions$ = of(loadProductNotifications({ type: 'stock' }));
      effects.loadProductNotifications$.subscribe(() => {
        verify(productNotificationsServiceMock.getProductNotifications('stock')).once();
        done();
      });
    });

    it('should map to actions of type LoadProductNotificationsSuccess', () => {
      const action = loadProductNotifications({ type: 'price' });
      const completion = loadProductNotificationsSuccess({
        productNotifications,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductNotifications$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type loadProductNotificationsFail', () => {
      when(productNotificationsServiceMock.getProductNotifications(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = loadProductNotifications({ type: 'price' });
      const completion = loadProductNotificationsFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductNotifications$).toBeObservable(expected$);
    });
  });
});
