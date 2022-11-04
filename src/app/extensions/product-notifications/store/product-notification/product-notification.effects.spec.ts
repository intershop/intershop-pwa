import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { loadProductNotifications } from './product-notification.actions';
import { ProductNotificationEffects } from './product-notification.effects';

describe('Product Notification Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductNotificationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductNotificationEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(ProductNotificationEffects);
  });

  describe('loadProductNotification$', () => {
    it('should not dispatch actions when encountering loadProductNotification', () => {
      const action = loadProductNotifications();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('------');

      expect(effects.loadProductNotifications$).toBeObservable(expected$);
    });
  });
});
