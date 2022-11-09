import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MatomoTracker, NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { Observable, of } from 'rxjs';
import { instance, mock, verify } from 'ts-mockito';

import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadProductPricesSuccess } from 'ish-core/store/shopping/product-prices';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { MatomoEffects } from './matomo.effects';

describe('Matomo Effects', () => {
  let actions$: Observable<Action>;
  let tracker: MatomoTracker;
  let effects: MatomoEffects;

  beforeEach(() => {
    tracker = mock(MatomoTracker);
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('user', 'basket'),
        NgxMatomoTrackerModule.forRoot({ disabled: true, trackerUrl: undefined, siteId: undefined }),
        RouterTestingModule.withRoutes([{ path: '**', children: [] }]),
      ],
      providers: [
        { provide: ApiTokenService, useFactory: () => instance(mock(ApiTokenService)) },
        { provide: MatomoTracker, useFactory: () => instance(tracker) },
        MatomoEffects,
        provideMockActions(() => actions$),
      ],
    });
    effects = TestBed.inject(MatomoEffects);
  });

  describe('trackPageViewTagManager', () => {
    it('should call the trackPageViewTagManager', done => {
      const price: ProductPriceDetails = { sku: '123', prices: {} };
      const prics: ProductPriceDetails[] = [price];
      const action = loadProductPricesSuccess({ prices: prics });

      actions$ = of(action);

      effects.trackPageViewTagManager.subscribe(() => {
        verify(tracker.trackEvent('ProductPageView', '123', 'pageView', 1)).once();
        done();
      });
    });
  });
});
