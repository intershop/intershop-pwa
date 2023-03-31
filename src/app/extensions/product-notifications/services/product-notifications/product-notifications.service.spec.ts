import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import {
  ProductNotification,
  ProductNotificationType,
} from '../../models/product-notification/product-notification.model';

import { ProductNotificationsService } from './product-notifications.service';

describe('Product Notifications Service', () => {
  let apiServiceMock: ApiService;
  let productNotificationsService: ProductNotificationsService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);

    when(apiServiceMock.get(anything())).thenReturn(of({ sku: '1234' }));
    when(apiServiceMock.resolveLinks()).thenReturn(() => of([]));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [
            { selector: getLoggedInCustomer, value: { customerNo: '4711', isBusinessCustomer: true } as Customer },
          ],
        }),
      ],
    });
    productNotificationsService = TestBed.inject(ProductNotificationsService);
  });

  it('should be created', () => {
    expect(productNotificationsService).toBeTruthy();
  });

  describe('getProductNotifications', () => {
    beforeEach(() => {
      when(apiServiceMock.get(anything())).thenReturn(of({ sku: '1234' }));
      when(apiServiceMock.resolveLinks()).thenReturn(() => of([]));
    });

    it("should get product stock notifications when 'getProductNotifications' for type stock is called for b2b rest applications", done => {
      productNotificationsService.getProductNotifications('stock').subscribe(data => {
        verify(apiServiceMock.get(`customers/4711/users/-/notifications/stock`)).once();
        expect(data).toMatchInlineSnapshot(`[]`);
        done();
      });
    });

    it("should get product price notifications when 'getProductNotifications' for type price is called for b2b rest applications", done => {
      productNotificationsService.getProductNotifications('price').subscribe(data => {
        verify(apiServiceMock.get(`customers/4711/users/-/notifications/price`)).once();
        expect(data).toMatchInlineSnapshot(`[]`);
        done();
      });
    });
  });

  describe('createProductNotification', () => {
    it('should return an error when called with a notification', done => {
      when(apiServiceMock.post(anything())).thenReturn(of({}));

      productNotificationsService.createProductNotification(undefined).subscribe({
        next: fail,
        error: err => {
          expect(err).toMatchInlineSnapshot(`[Error: createProductNotification() called without notification]`);
          done();
        },
      });

      verify(apiServiceMock.post(anything())).never();
    });

    it("should call 'createProductNotification' for creating a new price notification", done => {
      const productNotificationPrice = {
        sku: '12345',
        type: 'price',
        notificationMailAddress: 'test@test.intershop.de',
        price: { type: 'Money', value: 75, currency: 'USD' },
      } as ProductNotification;

      when(apiServiceMock.post(anything(), anything())).thenReturn(of({}));
      when(apiServiceMock.resolveLink()).thenReturn(() => of(productNotificationPrice));

      productNotificationsService.createProductNotification(productNotificationPrice).subscribe(() => {
        verify(apiServiceMock.post(anything(), anything())).once();
        expect(capture(apiServiceMock.post).last()[0]).toMatchInlineSnapshot(
          `"customers/4711/users/-/notifications/price"`
        );
        done();
      });
    });

    it("should call 'createProductNotification' for creating a new stock notification", done => {
      const productNotificationStock = {
        sku: '12345',
        type: 'stock',
        notificationMailAddress: 'test@test.intershop.de',
      } as ProductNotification;

      when(apiServiceMock.post(anything(), anything())).thenReturn(of({}));
      when(apiServiceMock.resolveLink()).thenReturn(() => of(productNotificationStock));

      productNotificationsService.createProductNotification(productNotificationStock).subscribe(() => {
        verify(apiServiceMock.post(anything(), anything())).once();
        expect(capture(apiServiceMock.post).last()[0]).toMatchInlineSnapshot(
          `"customers/4711/users/-/notifications/stock"`
        );
        done();
      });
    });
  });

  describe('updateProductNotification', () => {
    it('should return an error when called without a sku', done => {
      when(apiServiceMock.put(anything(), anything())).thenReturn(of({}));

      productNotificationsService.updateProductNotification(undefined, undefined).subscribe({
        next: fail,
        error: err => {
          expect(err).toMatchInlineSnapshot(`[Error: updateProductNotification() called without sku]`);
          done();
        },
      });

      verify(apiServiceMock.put(anything(), anything())).never();
    });

    it('should return an error when called without a notification', done => {
      const sku = '12345';

      when(apiServiceMock.put(anything(), anything())).thenReturn(of({}));

      productNotificationsService.updateProductNotification(sku, undefined).subscribe({
        next: fail,
        error: err => {
          expect(err).toMatchInlineSnapshot(`[Error: updateProductNotification() called without notification]`);
          done();
        },
      });

      verify(apiServiceMock.put(anything(), anything())).never();
    });

    it("should call 'updateProductNotification' for updating a price notification", done => {
      const sku = '12345';
      const productNotificationPrice = {
        id: '12345_price',
        sku: '12345',
        type: 'price',
        notificationMailAddress: 'test@test.intershop.de',
        price: { type: 'Money', value: 75, currency: 'USD' },
      } as ProductNotification;

      when(apiServiceMock.put(anything(), anything())).thenReturn(of(productNotificationPrice));
      when(apiServiceMock.resolveLink(anything())).thenReturn(() => of(productNotificationPrice));

      productNotificationsService.updateProductNotification(sku, productNotificationPrice).subscribe(() => {
        verify(apiServiceMock.put(anything(), anything())).once();
        expect(capture(apiServiceMock.put).last()[0]).toMatchInlineSnapshot(
          `"customers/4711/users/-/notifications/price/12345"`
        );
        done();
      });
    });

    it("should call 'updateProductNotification' for updating a stock notification", done => {
      const sku = '12345';
      const productNotificationStock = {
        id: '12345_stock',
        sku: '12345',
        type: 'stock',
        notificationMailAddress: 'test@test.intershop.de',
        price: { type: 'Money', value: 75, currency: 'USD' },
      } as ProductNotification;

      when(apiServiceMock.put(anything(), anything())).thenReturn(of(productNotificationStock));
      when(apiServiceMock.resolveLink(anything())).thenReturn(() => of(productNotificationStock));

      productNotificationsService.updateProductNotification(sku, productNotificationStock).subscribe(() => {
        verify(apiServiceMock.put(anything(), anything())).once();
        expect(capture(apiServiceMock.put).last()[0]).toMatchInlineSnapshot(
          `"customers/4711/users/-/notifications/stock/12345"`
        );
        done();
      });
    });
  });

  describe('deleteProductNotification', () => {
    it('should return an error when called without a sku', done => {
      const type: ProductNotificationType = 'price';

      when(apiServiceMock.delete(anything(), anything())).thenReturn(of({}));

      productNotificationsService.deleteProductNotification(undefined, type).subscribe({
        next: fail,
        error: err => {
          expect(err).toMatchInlineSnapshot(`[Error: deleteProductNotification() called without sku]`);
          done();
        },
      });

      verify(apiServiceMock.delete(anything(), anything())).never();
    });

    it('should return an error when called without a type', done => {
      const sku = '12345';

      when(apiServiceMock.delete(anything(), anything())).thenReturn(of({}));

      productNotificationsService.deleteProductNotification(sku, undefined).subscribe({
        next: fail,
        error: err => {
          expect(err).toMatchInlineSnapshot(`[Error: deleteProductNotification() called without type]`);
          done();
        },
      });

      verify(apiServiceMock.delete(anything(), anything())).never();
    });

    it("should call 'deleteProductNotification' for deleting a price notification", done => {
      const sku = '12345';
      const type: ProductNotificationType = 'price';

      when(apiServiceMock.delete(anything())).thenReturn(of({}));
      when(apiServiceMock.resolveLink(anything())).thenReturn(() => of({}));

      productNotificationsService.deleteProductNotification(sku, type).subscribe(() => {
        verify(apiServiceMock.delete(anything())).once();
        expect(capture(apiServiceMock.delete).last()[0]).toMatchInlineSnapshot(
          `"customers/4711/users/-/notifications/price/12345"`
        );
        done();
      });
    });

    it("should call 'deleteProductNotification' for deleting a stock notification", done => {
      const sku = '12345';
      const type: ProductNotificationType = 'stock';

      when(apiServiceMock.delete(anything())).thenReturn(of({}));
      when(apiServiceMock.resolveLink(anything())).thenReturn(() => of({}));

      productNotificationsService.deleteProductNotification(sku, type).subscribe(() => {
        verify(apiServiceMock.delete(anything())).once();
        expect(capture(apiServiceMock.delete).last()[0]).toMatchInlineSnapshot(
          `"customers/4711/users/-/notifications/stock/12345"`
        );
        done();
      });
    });

    it("should delete a notification when 'deleteProductNotification' is called", done => {
      const sku = '12345';
      const type: ProductNotificationType = 'price';

      when(apiServiceMock.delete(`customers/4711/users/-/notifications/${type}/${sku}`)).thenReturn(of({}));

      productNotificationsService.deleteProductNotification(sku, type).subscribe(() => {
        verify(apiServiceMock.delete(`customers/4711/users/-/notifications/${type}/${sku}`)).once();
        done();
      });
    });
  });
});
