import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { WishlistService } from 'ish-core/services/wishlist/wishlist.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadWishlist, loadWishlistFail, loadWishlistSuccess } from './wishlist.actions';
import { WishlistEffects } from './wishlist.effects';

describe('Wishlist Effects', () => {
  let actions$: Observable<Action>;
  let wishlistServiceMock: WishlistService;
  let effects: WishlistEffects;

  const wishlist = {
    title: 'testing wishlist',
    type: 'WishList',
    id: '.SKsEQAE4FIAAAFuNiUBWx0d',
    itemsCount: 0,
  };

  beforeEach(() => {
    wishlistServiceMock = mock(WishlistService);

    TestBed.configureTestingModule({
      providers: [
        { provide: WishlistService, useFactory: () => instance(wishlistServiceMock) },
        provideMockActions(() => actions$),
        WishlistEffects,
      ],
    });

    effects = TestBed.inject(WishlistEffects);
  });

  describe('loadWishlist$', () => {
    it('should dispatch LoadWishlistSuccess action on successful service call', () => {
      const action = loadWishlist({ id: 'testId', owner: 'testOwner', secureCode: 'testSecureCode' });
      const completion = loadWishlistSuccess({ wishlist });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      when(wishlistServiceMock.getWishlist('testId', 'testOwner', 'testSecureCode')).thenReturn(of(wishlist));

      expect(effects.loadWishlist$).toBeObservable(expected$);
    });

    it('should dispatch LoadWishlistFail action on failed service call', () => {
      const error = makeHttpError({ message: 'invalid' });
      const action = loadWishlist({ id: 'testId', owner: 'testOwner', secureCode: 'testSecureCode' });
      const completion = loadWishlistFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      when(wishlistServiceMock.getWishlist('testId', 'testOwner', 'testSecureCode')).thenReturn(
        throwError(() => error)
      );

      expect(effects.loadWishlist$).toBeObservable(expected$);
    });
  });
});
