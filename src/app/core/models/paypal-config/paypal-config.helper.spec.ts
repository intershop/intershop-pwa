import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { PaypalConfigHelper } from './paypal-config.helper';
import { PaypalConfig } from './paypal-config.model';

describe('Paypal Config Helper', () => {
  let helper: PaypalConfigHelper;
  let appFacadeMock: AppFacade;
  let scriptLoaderMock: ScriptLoaderService;

  beforeEach(() => {
    appFacadeMock = mock(AppFacade);
    scriptLoaderMock = mock(ScriptLoaderService);

    TestBed.configureTestingModule({
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacadeMock) },
        { provide: ScriptLoaderService, useFactory: () => instance(scriptLoaderMock) },
        PaypalConfigHelper,
      ],
    });

    helper = TestBed.inject(PaypalConfigHelper);
  });

  it('should be created', () => {
    expect(helper).toBeTruthy();
  });

  describe('isFundingEnabled', () => {
    let mockConfig: PaypalConfig;

    beforeEach(() => {
      mockConfig = {
        payLaterMessagingHome: false,
        payLaterMessagingProductDetails: true,
        payLaterMessagingCategory: false,
        payLaterMessagingCart: true,
        payLaterMessagingPayment: false,
        payLaterEnabled: true,
      };
    });

    it('should return true for product-details when payLaterMessagingProductDetails is enabled', () => {
      const result = helper.isFundingEnabled(mockConfig, 'product-details');
      expect(result).toBeTrue();
    });

    it('should return false for product-listing when payLaterMessagingCategory is disabled', () => {
      const result = helper.isFundingEnabled(mockConfig, 'product-listing');
      expect(result).toBeFalse();
    });

    it('should return true for cart page when payLaterMessagingCart is enabled', () => {
      const result = helper.isFundingEnabled(mockConfig, 'cart');
      expect(result).toBeTrue();
    });

    it('should return payLaterMessagingCart value for checkout page (default case)', () => {
      const result = helper.isFundingEnabled(mockConfig, 'checkout');
      expect(result).toBeTrue();
    });

    it('should return payLaterMessagingCart value for unknown page types (default case)', () => {
      const result = helper.isFundingEnabled(mockConfig, 'unknown-page');
      expect(result).toBeTrue();
    });
  });

  describe('loadPayPalScript', () => {
    it('should be a function', () => {
      expect(typeof helper.loadPayPalScript).toBe('function');
    });
  });

  describe('static properties', () => {
    it('should have correct PayPal script URL', () => {
      expect(PaypalConfigHelper.PAYPAL_SCRIPT_URL).toBe('https://www.paypal.com/sdk/js');
    });
  });
});
