import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaypalConfigMessaging } from 'ish-core/models/paypal-config/paypal-config.model';

import { PaypalConfigService } from './paypal-config.service';

describe('Paypal Config Service', () => {
  let helper: PaypalConfigService;
  let appFacadeMock: AppFacade;

  beforeEach(() => {
    appFacadeMock = mock(AppFacade);

    TestBed.configureTestingModule({
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacadeMock) }, PaypalConfigService],
    });

    helper = TestBed.inject(PaypalConfigService);
  });

  it('should be created', () => {
    expect(helper).toBeTruthy();
  });

  describe('isFundingEnabled', () => {
    let mockConfig: PaypalConfigMessaging;

    beforeEach(() => {
      mockConfig = {
        onHomepage: false,
        onProductDetailsPage: true,
        onCategoryPage: false,
        onCartPage: true,
        onPaymentPage: true,
      };
    });

    it('should return true for product-details when payLaterMessagingProductDetails is enabled', () => {
      const result = helper.isMessagingEnabled(mockConfig, 'product-details');
      expect(result).toBeTrue();
    });

    it('should return false for product-listing when payLaterMessagingCategory is disabled', () => {
      const result = helper.isMessagingEnabled(mockConfig, 'product-listing');
      expect(result).toBeFalse();
    });

    it('should return true for cart page when payLaterMessagingCart is enabled', () => {
      const result = helper.isMessagingEnabled(mockConfig, 'cart');
      expect(result).toBeTrue();
    });

    it('should return payLaterMessagingCart value for checkout page (default case)', () => {
      const result = helper.isMessagingEnabled(mockConfig, 'checkout');
      expect(result).toBeTrue();
    });

    it('should return payLaterMessagingCart value for unknown page types (default case)', () => {
      const result = helper.isMessagingEnabled(mockConfig, undefined);
      expect(result).toBeTrue();
    });
  });

  describe('loadPayPalScript', () => {
    it('should be a function', () => {
      expect(typeof helper.loadPayPalScript).toBe('function');
    });
  });
});
