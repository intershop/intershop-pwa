import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { wishlistsReducers } from '../wishlists-store.module';

import {
  CreateWishlist,
  CreateWishlistFail,
  CreateWishlistSuccess,
  DeleteWishlist,
  DeleteWishlistFail,
  DeleteWishlistSuccess,
  LoadWishlistDetails,
  LoadWishlistDetailsFail,
  LoadWishlistDetailsSuccess,
  LoadWishlists,
  LoadWishlistsFail,
  LoadWishlistsSuccess,
  SelectWishlist,
  UpdateWishlist,
  UpdateWishlistFail,
  UpdateWishlistSuccess,
} from './wishlist.actions';
import {
  getAllWishlists,
  getPreferredWishlist,
  getSelectedWishlistDetails,
  getSelectedWishlistId,
  getWishlistsError,
  getWishlistsLoading,
} from './wishlist.selectors';

describe('Wishlist Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        reducers: {
          ...coreReducers,
          wishlists: combineReducers(wishlistsReducers),
        },
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  const wishlistDetails = [
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

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getWishlistsLoading(store$.state)).toBeFalse();
    });
    it('should not have a selected wishlist when in initial state', () => {
      expect(getSelectedWishlistId(store$.state)).toBeUndefined();
    });
    it('should not have an error when in initial state', () => {
      expect(getWishlistsError(store$.state)).toBeUndefined();
    });
  });

  describe('loading wishlists', () => {
    describe('LoadWishlists', () => {
      const loadWishlistAction = new LoadWishlists();

      beforeEach(() => {
        store$.dispatch(loadWishlistAction);
      });

      it('should set loading to true', () => {
        expect(getWishlistsLoading(store$.state)).toBeTrue();
      });
    });

    describe('LoadWishlistsSuccess', () => {
      const loadWishlistSuccessAction = new LoadWishlistsSuccess({ wishlists: wishlistDetails });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(loadWishlistSuccessAction);
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add wishlists to state', () => {
        expect(getAllWishlists(store$.state)).toEqual(wishlistDetails);
      });
    });

    describe('LoadWishlistsFail', () => {
      const loadWishlistFailAction = new LoadWishlistsFail({ error: { message: 'invalid' } as HttpError });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(loadWishlistFailAction);
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getWishlistsError(store$.state)).toEqual({ message: 'invalid' });
      });
    });
  });

  describe('loading wishlist details', () => {
    describe('LoadWishlistDetails', () => {
      const loadWishlistDetailsAction = new LoadWishlistDetails({ wishlistId: 'id' });

      beforeEach(() => {
        store$.dispatch(loadWishlistDetailsAction);
      });

      it('should set loading to true', () => {
        expect(getWishlistsLoading(store$.state)).toBeTrue();
      });
    });

    describe('LoadWishlistDetailsSuccess', () => {
      const loadWishilstDetailsSuccessAction = new LoadWishlistDetailsSuccess({ wishlist: wishlistDetails[0] });
      const loadWishlistSuccessAction = new LoadWishlistsSuccess({ wishlists: wishlistDetails });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
      });

      it('should set loading to false', () => {
        store$.dispatch(loadWishilstDetailsSuccessAction);
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add wishlist details to state', () => {
        store$.dispatch(loadWishlistSuccessAction);
        store$.dispatch(loadWishilstDetailsSuccessAction);
        expect(getAllWishlists(store$.state)).toContainEqual(wishlistDetails[0]);
      });
    });

    describe('LoadWishlistDetailsFail', () => {
      const loadWishlistFailAction = new LoadWishlistDetailsFail({ error: { message: 'invalid' } as HttpError });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(loadWishlistFailAction);
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getWishlistsError(store$.state)).toEqual({ message: 'invalid' });
      });
    });
  });

  describe('create a wishlist', () => {
    describe('CreateWishlist', () => {
      const createWishlistAction = new CreateWishlist({
        wishlist: {
          title: 'create title',
          preferred: true,
        },
      });

      beforeEach(() => {
        store$.dispatch(createWishlistAction);
      });

      it('should set loading to true', () => {
        expect(getWishlistsLoading(store$.state)).toBeTrue();
      });
    });

    describe('CreateWishlistSuccess', () => {
      const createWishistSuccessAction = new CreateWishlistSuccess({ wishlist: wishlistDetails[0] });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(createWishistSuccessAction);
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add new wishlist to state', () => {
        expect(getAllWishlists(store$.state)).toContainEqual(wishlistDetails[0]);
      });
    });

    describe('CreateWishlistFail', () => {
      const createWishlistFailAction = new CreateWishlistFail({ error: { message: 'invalid' } as HttpError });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(createWishlistFailAction);
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getWishlistsError(store$.state)).toEqual({ message: 'invalid' });
      });
    });
  });

  describe('delete a wishlist', () => {
    describe('DeleteWishlist', () => {
      const deleteWishlistAction = new DeleteWishlist({ wishlistId: 'id' });

      beforeEach(() => {
        store$.dispatch(deleteWishlistAction);
      });

      it('should set loading to true', () => {
        expect(getWishlistsLoading(store$.state)).toBeTrue();
      });
    });

    describe('DeleteWishlistSuccess', () => {
      const deleteWishlistSuccessAction = new DeleteWishlistSuccess({ wishlistId: wishlistDetails[0].id });
      const loadWishlistDetailsSuccessAction = new LoadWishlistDetailsSuccess({ wishlist: wishlistDetails[0] });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
      });

      it('should set loading to false', () => {
        store$.dispatch(deleteWishlistSuccessAction);

        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should remove wishlist from state, when wishlist delete action was called', () => {
        store$.dispatch(loadWishlistDetailsSuccessAction);
        store$.dispatch(deleteWishlistSuccessAction);

        expect(getAllWishlists(store$.state)).not.toContain(wishlistDetails[0]);
      });
    });

    describe('DeleteWishlistFail', () => {
      const deleteWishlistFailAction = new DeleteWishlistFail({ error: { message: 'invalid' } as HttpError });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(deleteWishlistFailAction);
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getWishlistsError(store$.state)).toEqual({ message: 'invalid' });
      });
    });
  });

  describe('updating a wishlist', () => {
    describe('UpdateWishlist', () => {
      const updateWishlistAction = new UpdateWishlist({ wishlist: wishlistDetails[0] });

      beforeEach(() => {
        store$.dispatch(updateWishlistAction);
      });

      it('should set loading to true', () => {
        expect(getWishlistsLoading(store$.state)).toBeTrue();
      });
    });

    describe('UpdateWishlistSuccess', () => {
      const updated = {
        ...wishlistDetails[0],
        title: 'new title',
      };
      const updateWishlistSuccessAction = new UpdateWishlistSuccess({
        wishlist: updated,
      });
      const loadWishlistSuccess = new LoadWishlistsSuccess({ wishlists: wishlistDetails });
      const loadWishlistDetailsSuccess = new LoadWishlistDetailsSuccess({ wishlist: wishlistDetails[0] });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
      });

      it('should set loading to false', () => {
        store$.dispatch(updateWishlistSuccessAction);

        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should update wishlist title to new title', () => {
        store$.dispatch(loadWishlistSuccess);
        store$.dispatch(loadWishlistDetailsSuccess);
        store$.dispatch(updateWishlistSuccessAction);

        expect(getAllWishlists(store$.state)).toContainEqual(updated);
      });
    });

    describe('UpdateWishlistFail', () => {
      const updateWishlistFailAction = new UpdateWishlistFail({ error: { message: 'invalid' } as HttpError });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(updateWishlistFailAction);
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getWishlistsError(store$.state)).toEqual({ message: 'invalid' });
      });
    });
  });

  describe('Get Selected Wishlist', () => {
    const loadWishlistsSuccessActions = new LoadWishlistsSuccess({ wishlists: wishlistDetails });
    const loadWishlistDetails1SuccessAction = new LoadWishlistDetailsSuccess({ wishlist: wishlistDetails[0] });
    const loadWishlistDetails2SuccessAction = new LoadWishlistDetailsSuccess({ wishlist: wishlistDetails[1] });
    const selectWishlistAction = new SelectWishlist({ id: wishlistDetails[1].id });

    beforeEach(() => {
      store$.dispatch(loadWishlistsSuccessActions);
      store$.dispatch(loadWishlistDetails1SuccessAction);
      store$.dispatch(loadWishlistDetails2SuccessAction);
      store$.dispatch(selectWishlistAction);
    });

    it('should return correct wishlist id for given id', () => {
      expect(getSelectedWishlistId(store$.state)).toEqual(wishlistDetails[1].id);
    });

    it('should return correct wishlist details for given id', () => {
      expect(getSelectedWishlistDetails(store$.state)).toEqual(wishlistDetails[1]);
    });
  });

  describe('Get Preferred Wishlist', () => {
    const loadWishlistsSuccessActions = new LoadWishlistsSuccess({ wishlists: wishlistDetails });
    const loadWishlistDetails1SuccessAction = new LoadWishlistDetailsSuccess({ wishlist: wishlistDetails[0] });
    const loadWishlistDetails2SuccessAction = new LoadWishlistDetailsSuccess({ wishlist: wishlistDetails[1] });

    beforeEach(() => {
      store$.dispatch(loadWishlistsSuccessActions);
      store$.dispatch(loadWishlistDetails1SuccessAction);
      store$.dispatch(loadWishlistDetails2SuccessAction);
    });

    it('should return correct wishlist for given title', () => {
      expect(getPreferredWishlist(store$.state)).toEqual(wishlistDetails[0]);
    });
  });
});
