import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { ApplyConfiguration } from 'ish-core/store/configuration';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { SuccessMessage } from 'ish-core/store/messages';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoginUserSuccess, LogoutUser } from 'ish-core/store/user';
import { userReducer } from 'ish-core/store/user/user.reducer';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { Wishlist } from '../../models/wishlist/wishlist.model';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { wishlistsReducers } from '../wishlists-store.module';

import {
  AddProductToNewWishlist,
  AddProductToWishlist,
  AddProductToWishlistFail,
  AddProductToWishlistSuccess,
  CreateWishlist,
  CreateWishlistFail,
  CreateWishlistSuccess,
  DeleteWishlist,
  DeleteWishlistFail,
  DeleteWishlistSuccess,
  LoadWishlists,
  LoadWishlistsFail,
  LoadWishlistsSuccess,
  MoveItemToWishlist,
  RemoveItemFromWishlist,
  RemoveItemFromWishlistFail,
  RemoveItemFromWishlistSuccess,
  ResetWishlistState,
  SelectWishlist,
  UpdateWishlist,
  UpdateWishlistFail,
  UpdateWishlistSuccess,
  WishlistsActionTypes,
} from './wishlist.actions';
import { WishlistEffects } from './wishlist.effects';

describe('Wishlist Effects', () => {
  let actions$;
  let wishlistServiceMock: WishlistService;
  let effects: WishlistEffects;
  let store$: TestStore;
  let router: Router;

  const customer = { customerNo: 'CID', type: 'SMBCustomer' } as Customer;

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
        FeatureToggleModule,
        RouterTestingModule.withRoutes([{ path: 'account/wishlist/:wishlistName', component: DummyComponent }]),
        ngrxTesting({
          reducers: {
            wishlists: combineReducers(wishlistsReducers),
            shopping: combineReducers(shoppingReducers),
            checkout: combineReducers(checkoutReducers),
            user: userReducer,
            configuration: configurationReducer,
          },
          routerStore: true,
        }),
      ],
      providers: [
        WishlistEffects,
        provideMockActions(() => actions$),
        { provide: WishlistService, useFactory: () => instance(wishlistServiceMock) },
      ],
    });

    effects = TestBed.get(WishlistEffects);
    store$ = TestBed.get(TestStore);
    router = TestBed.get(Router);

    store$.dispatch(new ApplyConfiguration({ features: ['wishlists'] }));
  });

  describe('loadWishlists$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(wishlistServiceMock.getWishlists()).thenReturn(of(wishlists));
    });

    it('should call the wishlistService for loadWishlists', done => {
      const action = new LoadWishlists();
      actions$ = of(action);

      effects.loadWishlists$.subscribe(() => {
        verify(wishlistServiceMock.getWishlists()).once();
        done();
      });
    });

    it('should map to actions of type LoadWishlistsSuccess', () => {
      const action = new LoadWishlists();
      const completion = new LoadWishlistsSuccess({
        wishlists,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadWishlists$).toBeObservable(expected$);
    });

    it('should map failed calls to actions of type LoadWishlistsFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(wishlistServiceMock.getWishlists()).thenReturn(throwError(error));
      const action = new LoadWishlists();
      const completion = new LoadWishlistsFail({
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
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(wishlistServiceMock.createWishlist(anything())).thenReturn(of(wishlistData[0]));
    });

    it('should call the wishlistService for createWishlist', done => {
      const action = new CreateWishlist({ wishlist: createWishlistData });
      actions$ = of(action);

      effects.createWishlist$.subscribe(() => {
        verify(wishlistServiceMock.createWishlist(anything())).once();
        done();
      });
    });

    it('should map to actions of type CreateWishlistSuccess and SuccessMessage', () => {
      const action = new CreateWishlist({ wishlist: createWishlistData });
      const completion1 = new CreateWishlistSuccess({
        wishlist: wishlistData[0],
      });
      const completion2 = new SuccessMessage({
        message: 'account.wishlists.new_wishlist.confirmation',
        messageParams: { 0: createWishlistData.title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.createWishlist$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type CreateWishlistFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(wishlistServiceMock.createWishlist(anything())).thenReturn(throwError(error));
      const action = new CreateWishlist({ wishlist: createWishlistData });
      const completion = new CreateWishlistFail({
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
      const action = new CreateWishlistSuccess({ wishlist: createdWishlist });
      const completion = new LoadWishlists();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.reloadWishlists$).toBeObservable(expected$);
    });
  });

  describe('deleteWishlist$', () => {
    const id = wishlists[0].id;
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer }));
      store$.dispatch(new CreateWishlistSuccess({ wishlist: wishlists[0] }));
      when(wishlistServiceMock.deleteWishlist(anyString())).thenReturn(of(undefined));
    });

    it('should call the wishlistService for deleteWishlist', done => {
      const action = new DeleteWishlist({ wishlistId: id });
      actions$ = of(action);

      effects.deleteWishlist$.subscribe(() => {
        verify(wishlistServiceMock.deleteWishlist(id)).once();
        done();
      });
    });

    it('should map to actions of type DeleteWishlistSuccess', () => {
      const action = new DeleteWishlist({ wishlistId: id });
      const completion1 = new DeleteWishlistSuccess({ wishlistId: id });
      const completion2 = new SuccessMessage({
        message: 'account.wishlists.delete_wishlist.confirmation',
        messageParams: { 0: wishlists[0].title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.deleteWishlist$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type DeleteWishlistFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(wishlistServiceMock.deleteWishlist(anyString())).thenReturn(throwError(error));
      const action = new DeleteWishlist({ wishlistId: id });
      const completion = new DeleteWishlistFail({
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
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(wishlistServiceMock.updateWishlist(anything())).thenReturn(of(wishlistDetailData[0]));
    });

    it('should call the wishlistService for updateWishlist', done => {
      const action = new UpdateWishlist({ wishlist: wishlistDetailData[0] });
      actions$ = of(action);

      effects.updateWishlist$.subscribe(() => {
        verify(wishlistServiceMock.updateWishlist(anything())).once();
        done();
      });
    });

    it('should map to actions of type UpdateWishlistSuccess', () => {
      const action = new UpdateWishlist({ wishlist: wishlistDetailData[0] });
      const completion1 = new UpdateWishlistSuccess({ wishlist: wishlistDetailData[0] });
      const completion2 = new SuccessMessage({
        message: 'account.wishlists.edit_wishlist.confirmation',
        messageParams: { 0: wishlistDetailData[0].title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.updateWishlist$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type UpdateWishlistFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(wishlistServiceMock.updateWishlist(anything())).thenReturn(throwError(error));
      const action = new UpdateWishlist({ wishlist: wishlistDetailData[0] });
      const completion = new UpdateWishlistFail({
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
      const action = new UpdateWishlistSuccess({ wishlist: updatedWishlist });
      const completion = new LoadWishlists();
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
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(wishlistServiceMock.addProductToWishlist(anyString(), anyString(), anyNumber())).thenReturn(
        of(wishlists[0])
      );
    });

    it('should call the wishlistService for addProductToWishlist', done => {
      const action = new AddProductToWishlist(payload);
      actions$ = of(action);

      effects.addProductToWishlist$.subscribe(() => {
        verify(wishlistServiceMock.addProductToWishlist(payload.wishlistId, payload.sku, payload.quantity)).once();
        done();
      });
    });

    it('should map to actions of type AddProductToWishlistSuccess', () => {
      const action = new AddProductToWishlist(payload);
      const completion = new AddProductToWishlistSuccess({ wishlist: wishlists[0] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.addProductToWishlist$).toBeObservable(expected$);
    });

    it('should map failed calls to actions of type AddProductToWishlistFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(wishlistServiceMock.addProductToWishlist(anyString(), anyString(), anything())).thenReturn(
        throwError(error)
      );
      const action = new AddProductToWishlist(payload);
      const completion = new AddProductToWishlistFail({
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
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(wishlistServiceMock.createWishlist(anything())).thenReturn(of(wishlist));
    });
    it('should map to actions of types CreateWishlistSuccess and AddProductToWishlist', () => {
      const action = new AddProductToNewWishlist(payload);
      const completion1 = new CreateWishlistSuccess({ wishlist });
      const completion2 = new AddProductToWishlist({ wishlistId: wishlist.id, sku: payload.sku });
      const completion3 = new SelectWishlist({ id: wishlist.id });
      actions$ = hot('-a-----a-----a', { a: action });
      const expected$ = cold('-(bcd)-(bcd)-(bcd)', { b: completion1, c: completion2, d: completion3 });
      expect(effects.addProductToNewWishlist$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type CreateWishlistFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(wishlistServiceMock.createWishlist(anything())).thenReturn(throwError(error));
      const action = new AddProductToNewWishlist(payload);
      const completion = new CreateWishlistFail({
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
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(wishlistServiceMock.createWishlist(anything())).thenReturn(of(wishlist));
    });
    it('should map to actions of types AddProductToNewWishlist and RemoveItemFromWishlist if there is no target id given', () => {
      const action = new MoveItemToWishlist(payload1);
      const completion1 = new AddProductToNewWishlist({ title: payload1.target.title, sku: payload1.target.sku });
      const completion2 = new RemoveItemFromWishlist({ wishlistId: payload1.source.id, sku: payload1.target.sku });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(bc)-(bc)-(bc)', { b: completion1, c: completion2 });
      expect(effects.moveItemToWishlist$).toBeObservable(expected$);
    });
    it('should map to actions of types AddProductToWishlist and RemoveItemFromWishlist if there is a target id given', () => {
      const action = new MoveItemToWishlist(payload2);
      const completion1 = new AddProductToWishlist({ wishlistId: wishlist.id, sku: payload1.target.sku });
      const completion2 = new RemoveItemFromWishlist({ wishlistId: payload1.source.id, sku: payload1.target.sku });
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
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(wishlistServiceMock.removeProductFromWishlist(anyString(), anyString())).thenReturn(of(wishlist));
    });

    it('should call the wishlistService for removeProductFromWishlist', done => {
      const action = new RemoveItemFromWishlist(payload);
      actions$ = of(action);

      effects.removeProductFromWishlist$.subscribe(() => {
        verify(wishlistServiceMock.removeProductFromWishlist(payload.wishlistId, payload.sku)).once();
        done();
      });
    });
    it('should map to actions of type RemoveItemFromWishlistSuccess', () => {
      const action = new RemoveItemFromWishlist(payload);
      const completion = new RemoveItemFromWishlistSuccess({ wishlist });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.removeProductFromWishlist$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type RemoveItemFromWishlistFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(wishlistServiceMock.removeProductFromWishlist(anyString(), anyString())).thenReturn(throwError(error));
      const action = new RemoveItemFromWishlist(payload);
      const completion = new RemoveItemFromWishlistFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.removeProductFromWishlist$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForSelectedWishlist$', () => {
    it('should map to action of type SelectWishlist', done => {
      router.navigateByUrl('/account/wishlist/.SKsEQAE4FIAAAFuNiUBWx0d');

      effects.routeListenerForSelectedWishlist$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Wishlists Internal] Select Wishlist:
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
        expect(action.type).toEqual(WishlistsActionTypes.LoadWishlists);
        done();
      });

      store$.dispatch(new LoginUserSuccess({ customer }));
    });
  });

  describe('resetWishlistStateAfterLogout$', () => {
    it('should map to action of type ResetWishlistState if LogoutUser action triggered', () => {
      const action = new LogoutUser();
      const completion = new ResetWishlistState();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.resetWishlistStateAfterLogout$).toBeObservable(expected$);
    });
  });

  describe('setWishlistBreadcrumb$', () => {
    beforeEach(() => {
      store$.dispatch(new LoadWishlistsSuccess({ wishlists }));
      store$.dispatch(new SelectWishlist({ id: wishlists[0].id }));
    });

    it('should set the breadcrumb of the selected wishlist', done => {
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
  });
});
