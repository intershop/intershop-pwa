import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Customer } from 'ish-core/models/customer/customer.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { Wishlist } from '../../models/wishlist/wishlist.model';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { WishlistsStoreModule } from '../wishlists-store.module';

import {
  addProductToNewWishlist,
  addProductToWishlist,
  addProductToWishlistFail,
  addProductToWishlistSuccess,
  createWishlist,
  createWishlistFail,
  createWishlistSuccess,
  deleteWishlist,
  deleteWishlistFail,
  deleteWishlistSuccess,
  loadWishlists,
  loadWishlistsFail,
  loadWishlistsSuccess,
  moveItemToWishlist,
  removeItemFromWishlist,
  removeItemFromWishlistFail,
  removeItemFromWishlistSuccess,
  selectWishlist,
  updateWishlist,
  updateWishlistFail,
  updateWishlistSuccess,
} from './wishlist.actions';
import { WishlistEffects } from './wishlist.effects';

describe('Wishlist Effects', () => {
  let actions$;
  let wishlistServiceMock: WishlistService;
  let effects: WishlistEffects;
  let store$: Store;
  let router: Router;

  const customer = { customerNo: 'CID', isBusinessCustomer: true } as Customer;

  const wishlists = [
    {
      title: 'testing wishlist',
      type: 'WishList',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemsCount: 0,
      preferred: true,
      public: false,
    },
    {
      title: 'testing wishlist 2',
      type: 'WishList',
      id: '.AsdHS18FIAAAFuNiUBWx0d',
      itemsCount: 0,
      preferred: false,
      public: false,
    },
  ];
  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    wishlistServiceMock = mock(WishlistService);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        CustomerStoreModule.forTesting('user'),
        FeatureToggleModule.forTesting('wishlists'),
        RouterTestingModule.withRoutes([{ path: 'account/wishlists/:wishlistName', component: DummyComponent }]),
        WishlistsStoreModule.forTesting('wishlists'),
      ],
      providers: [
        WishlistEffects,
        provideMockActions(() => actions$),
        { provide: WishlistService, useFactory: () => instance(wishlistServiceMock) },
      ],
    });

    effects = TestBed.inject(WishlistEffects);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  describe('loadWishlists$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(wishlistServiceMock.getWishlists()).thenReturn(of(wishlists));
    });

    it('should call the wishlistService for loadWishlists', done => {
      const action = loadWishlists();
      actions$ = of(action);

      effects.loadWishlists$.subscribe(() => {
        verify(wishlistServiceMock.getWishlists()).once();
        done();
      });
    });

    it('should map to actions of type LoadWishlistsSuccess', () => {
      const action = loadWishlists();
      const completion = loadWishlistsSuccess({
        wishlists,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadWishlists$).toBeObservable(expected$);
    });

    it('should map failed calls to actions of type LoadWishlistsFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(wishlistServiceMock.getWishlists()).thenReturn(throwError(error));
      const action = loadWishlists();
      const completion = loadWishlistsFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadWishlists$).toBeObservable(expected$);
    });
  });

  describe('createWishlist$', () => {
    const wishlistData = [
      {
        title: 'testing wishlist',
        id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      } as Wishlist,
    ];
    const createWishlistData = {
      title: 'testing wishlist',
      preferred: true,
      public: false,
    };
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(wishlistServiceMock.createWishlist(anything())).thenReturn(of(wishlistData[0]));
    });

    it('should call the wishlistService for createWishlist', done => {
      const action = createWishlist({ wishlist: createWishlistData });
      actions$ = of(action);

      effects.createWishlist$.subscribe(() => {
        verify(wishlistServiceMock.createWishlist(anything())).once();
        done();
      });
    });

    it('should map to actions of type CreateWishlistSuccess and SuccessMessage', () => {
      const action = createWishlist({ wishlist: createWishlistData });
      const completion1 = createWishlistSuccess({
        wishlist: wishlistData[0],
      });
      const completion2 = displaySuccessMessage({
        message: 'account.wishlists.new_wishlist.confirmation',
        messageParams: { 0: createWishlistData.title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.createWishlist$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type CreateWishlistFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(wishlistServiceMock.createWishlist(anything())).thenReturn(throwError(error));
      const action = createWishlist({ wishlist: createWishlistData });
      const completion = createWishlistFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createWishlist$).toBeObservable(expected$);
    });

    it('should map to action of type LoadWishlists if the wishlist is created as preferred', () => {
      const createdWishlist: Wishlist = {
        id: '1234',
        title: 'title',
        preferred: true,
        public: false,
      };
      const action = createWishlistSuccess({ wishlist: createdWishlist });
      const completion = loadWishlists();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.reloadWishlists$).toBeObservable(expected$);
    });
  });

  describe('deleteWishlist$', () => {
    const id = wishlists[0].id;
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(createWishlistSuccess({ wishlist: wishlists[0] }));
      when(wishlistServiceMock.deleteWishlist(anyString())).thenReturn(of(undefined));
    });

    it('should call the wishlistService for deleteWishlist', done => {
      const action = deleteWishlist({ wishlistId: id });
      actions$ = of(action);

      effects.deleteWishlist$.subscribe(() => {
        verify(wishlistServiceMock.deleteWishlist(id)).once();
        done();
      });
    });

    it('should map to actions of type DeleteWishlistSuccess', () => {
      const action = deleteWishlist({ wishlistId: id });
      const completion1 = deleteWishlistSuccess({ wishlistId: id });
      const completion2 = displaySuccessMessage({
        message: 'account.wishlists.delete_wishlist.confirmation',
        messageParams: { 0: wishlists[0].title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.deleteWishlist$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type DeleteWishlistFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(wishlistServiceMock.deleteWishlist(anyString())).thenReturn(throwError(error));
      const action = deleteWishlist({ wishlistId: id });
      const completion = deleteWishlistFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteWishlist$).toBeObservable(expected$);
    });
  });

  describe('updateWishlist$', () => {
    const wishlistDetailData = [
      {
        title: 'testing wishlist',
        id: '.SKsEQAE4FIAAAFuNiUBWx0d',
        itemCount: 0,
        preferred: true,
        public: false,
      },
    ];
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(wishlistServiceMock.updateWishlist(anything())).thenReturn(of(wishlistDetailData[0]));
    });

    it('should call the wishlistService for updateWishlist', done => {
      const action = updateWishlist({ wishlist: wishlistDetailData[0] });
      actions$ = of(action);

      effects.updateWishlist$.subscribe(() => {
        verify(wishlistServiceMock.updateWishlist(anything())).once();
        done();
      });
    });

    it('should map to actions of type UpdateWishlistSuccess', () => {
      const action = updateWishlist({ wishlist: wishlistDetailData[0] });
      const completion1 = updateWishlistSuccess({ wishlist: wishlistDetailData[0] });
      const completion2 = displaySuccessMessage({
        message: 'account.wishlists.edit_wishlist.confirmation',
        messageParams: { 0: wishlistDetailData[0].title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.updateWishlist$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type UpdateWishlistFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(wishlistServiceMock.updateWishlist(anything())).thenReturn(throwError(error));
      const action = updateWishlist({ wishlist: wishlistDetailData[0] });
      const completion = updateWishlistFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateWishlist$).toBeObservable(expected$);
    });

    it('should map to action of type LoadWishlists if the wishlist is updated as preferred', () => {
      const updatedWishlist: Wishlist = {
        id: '1234',
        title: 'title',
        preferred: true,
        public: false,
      };
      const action = updateWishlistSuccess({ wishlist: updatedWishlist });
      const completion = loadWishlists();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.reloadWishlists$).toBeObservable(expected$);
    });
  });

  describe('addProductToWishlist$', () => {
    const payload = {
      wishlistId: '.SKsEQAE4FIAAAFuNiUBWx0d',
      sku: 'sku',
      quantity: 2,
    };

    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(wishlistServiceMock.addProductToWishlist(anyString(), anyString(), anyNumber())).thenReturn(
        of(wishlists[0])
      );
    });

    it('should call the wishlistService for addProductToWishlist', done => {
      const action = addProductToWishlist(payload);
      actions$ = of(action);

      effects.addProductToWishlist$.subscribe(() => {
        verify(wishlistServiceMock.addProductToWishlist(payload.wishlistId, payload.sku, payload.quantity)).once();
        done();
      });
    });

    it('should map to actions of type AddProductToWishlistSuccess', () => {
      const action = addProductToWishlist(payload);
      const completion = addProductToWishlistSuccess({ wishlist: wishlists[0] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.addProductToWishlist$).toBeObservable(expected$);
    });

    it('should map failed calls to actions of type AddProductToWishlistFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(wishlistServiceMock.addProductToWishlist(anyString(), anyString(), anything())).thenReturn(
        throwError(error)
      );
      const action = addProductToWishlist(payload);
      const completion = addProductToWishlistFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToWishlist$).toBeObservable(expected$);
    });
  });

  describe('addProductToNewWishlist$', () => {
    const payload = {
      title: 'new wishlist',
      sku: 'sku',
    };
    const wishlist = {
      title: 'testing wishlist',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemCount: 0,
      preferred: true,
      public: false,
    };
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(wishlistServiceMock.createWishlist(anything())).thenReturn(of(wishlist));
    });
    it('should map to actions of types CreateWishlistSuccess and AddProductToWishlist', () => {
      const action = addProductToNewWishlist(payload);
      const completion1 = createWishlistSuccess({ wishlist });
      const completion2 = addProductToWishlist({ wishlistId: wishlist.id, sku: payload.sku });
      const completion3 = selectWishlist({ id: wishlist.id });
      actions$ = hot('-a-----a-----a', { a: action });
      const expected$ = cold('-(bcd)-(bcd)-(bcd)', { b: completion1, c: completion2, d: completion3 });
      expect(effects.addProductToNewWishlist$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type CreateWishlistFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(wishlistServiceMock.createWishlist(anything())).thenReturn(throwError(error));
      const action = addProductToNewWishlist(payload);
      const completion = createWishlistFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToNewWishlist$).toBeObservable(expected$);
    });
  });

  describe('moveProductToWishlist$', () => {
    const payload1 = {
      source: { id: '1234' },
      target: { title: 'new wishlist', sku: 'sku' },
    };
    const payload2 = {
      source: { id: '1234' },
      target: { id: '.SKsEQAE4FIAAAFuNiUBWx0d', sku: 'sku' },
    };
    const wishlist = {
      title: 'testing wishlist',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemCount: 0,
      preferred: true,
      public: false,
    };
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(wishlistServiceMock.createWishlist(anything())).thenReturn(of(wishlist));
    });
    it('should map to actions of types AddProductToNewWishlist and RemoveItemFromWishlist if there is no target id given', () => {
      const action = moveItemToWishlist(payload1);
      const completion1 = addProductToNewWishlist({ title: payload1.target.title, sku: payload1.target.sku });
      const completion2 = removeItemFromWishlist({ wishlistId: payload1.source.id, sku: payload1.target.sku });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(bc)-(bc)-(bc)', { b: completion1, c: completion2 });
      expect(effects.moveItemToWishlist$).toBeObservable(expected$);
    });
    it('should map to actions of types AddProductToWishlist and RemoveItemFromWishlist if there is a target id given', () => {
      const action = moveItemToWishlist(payload2);
      const completion1 = addProductToWishlist({ wishlistId: wishlist.id, sku: payload1.target.sku });
      const completion2 = removeItemFromWishlist({ wishlistId: payload1.source.id, sku: payload1.target.sku });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(bc)-(bc)-(bc)', { b: completion1, c: completion2 });
      expect(effects.moveItemToWishlist$).toBeObservable(expected$);
    });
  });

  describe('removeProductFromWishlist$', () => {
    const payload = {
      wishlistId: '.SKsEQAE4FIAAAFuNiUBWx0d',
      sku: 'sku',
    };
    const wishlist = {
      title: 'testing wishlist',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemCount: 0,
      preferred: true,
      public: false,
    };
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(wishlistServiceMock.removeProductFromWishlist(anyString(), anyString())).thenReturn(of(wishlist));
    });

    it('should call the wishlistService for removeProductFromWishlist', done => {
      const action = removeItemFromWishlist(payload);
      actions$ = of(action);

      effects.removeProductFromWishlist$.subscribe(() => {
        verify(wishlistServiceMock.removeProductFromWishlist(payload.wishlistId, payload.sku)).once();
        done();
      });
    });
    it('should map to actions of type RemoveItemFromWishlistSuccess', () => {
      const action = removeItemFromWishlist(payload);
      const completion = removeItemFromWishlistSuccess({ wishlist });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.removeProductFromWishlist$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type RemoveItemFromWishlistFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(wishlistServiceMock.removeProductFromWishlist(anyString(), anyString())).thenReturn(throwError(error));
      const action = removeItemFromWishlist(payload);
      const completion = removeItemFromWishlistFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.removeProductFromWishlist$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForSelectedWishlist$', () => {
    it('should map to action of type SelectWishlist', done => {
      router.navigateByUrl('/account/wishlists/.SKsEQAE4FIAAAFuNiUBWx0d');

      effects.routeListenerForSelectedWishlist$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Wishlist Internal] Select Wishlist:
            id: ".SKsEQAE4FIAAAFuNiUBWx0d"
        `);
        done();
      });
    });
  });

  describe('loadWishlistsAfterLogin$', () => {
    beforeEach(() => {
      when(wishlistServiceMock.getWishlists()).thenReturn(of(wishlists));
    });
    it('should call WishlistsService after login action was dispatched', done => {
      effects.loadWishlistsAfterLogin$.subscribe(action => {
        expect(action.type).toEqual(loadWishlists.type);
        done();
      });

      store$.dispatch(loginUserSuccess({ customer }));
    });
  });

  describe('setWishlistBreadcrumb$', () => {
    beforeEach(() => {
      store$.dispatch(loadWishlistsSuccess({ wishlists }));
      store$.dispatch(selectWishlist({ id: wishlists[0].id }));
    });

    it('should set the breadcrumb of the selected wishlist in my account area', done => {
      router.navigateByUrl('/account/wishlists/' + wishlists[0].id);

      effects.setWishlistBreadcrumb$.subscribe(action => {
        expect(action.payload).toMatchInlineSnapshot(`
          Object {
            "breadcrumbData": Array [
              Object {
                "key": "account.wishlists.breadcrumb_link",
                "link": "/account/wishlists",
              },
              Object {
                "text": "testing wishlist",
              },
            ],
          }
        `);
        done();
      });
    });

    it('should not set the breadcrumb of the selected wishlist when on another url', done => {
      effects.setWishlistBreadcrumb$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
  });
});
