import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { WishlistsStoreModule } from '../wishlists-store.module';

import {
  createWishlist,
  createWishlistFail,
  createWishlistSuccess,
  deleteWishlist,
  deleteWishlistFail,
  deleteWishlistSuccess,
  loadWishlists,
  loadWishlistsFail,
  loadWishlistsSuccess,
  selectWishlist,
  updateWishlist,
  updateWishlistFail,
  updateWishlistSuccess,
} from './wishlist.actions';
import {
  getAllWishlists,
  getPreferredWishlist,
  getSelectedWishlistDetails,
  getSelectedWishlistId,
  getWishlistDetails,
  getWishlistsError,
  getWishlistsLoading,
} from './wishlist.selectors';

describe('Wishlist Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), WishlistsStoreModule.forTesting('wishlists')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

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
      const loadWishlistAction = loadWishlists();

      beforeEach(() => {
        store$.dispatch(loadWishlistAction);
      });

      it('should set loading to true', () => {
        expect(getWishlistsLoading(store$.state)).toBeTrue();
      });
    });

    describe('LoadWishlistsSuccess', () => {
      beforeEach(() => {
        store$.dispatch(loadWishlistsSuccess({ wishlists }));
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add wishlists to state', () => {
        expect(getAllWishlists(store$.state)).toEqual(wishlists);
      });
    });

    describe('LoadWishlistsFail', () => {
      beforeEach(() => {
        store$.dispatch(loadWishlistsFail({ error: makeHttpError({ message: 'invalid' }) }));
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getWishlistsError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('create a wishlist', () => {
    describe('CreateWishlist', () => {
      const createWishlistAction = createWishlist({
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
      beforeEach(() => {
        store$.dispatch(createWishlistSuccess({ wishlist: wishlists[0] }));
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add new wishlist to state', () => {
        expect(getAllWishlists(store$.state)).toContainEqual(wishlists[0]);
      });
    });

    describe('CreateWishlistFail', () => {
      beforeEach(() => {
        store$.dispatch(createWishlistFail({ error: makeHttpError({ message: 'invalid' }) }));
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getWishlistsError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('delete a wishlist', () => {
    describe('DeleteWishlist', () => {
      beforeEach(() => {
        store$.dispatch(deleteWishlist({ wishlistId: 'id' }));
      });

      it('should set loading to true', () => {
        expect(getWishlistsLoading(store$.state)).toBeTrue();
      });
    });

    describe('DeleteWishlistSuccess', () => {
      const loadWishlistSuccessAction = loadWishlistsSuccess({ wishlists });
      const deleteWishlistSuccessAction = deleteWishlistSuccess({ wishlistId: wishlists[0].id });

      it('should set loading to false', () => {
        store$.dispatch(deleteWishlistSuccessAction);

        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should remove wishlist from state, when wishlist delete action was called', () => {
        store$.dispatch(loadWishlistSuccessAction);
        store$.dispatch(deleteWishlistSuccessAction);

        expect(getAllWishlists(store$.state)).not.toContain(wishlists[0]);
      });
    });

    describe('DeleteWishlistFail', () => {
      beforeEach(() => {
        store$.dispatch(deleteWishlistFail({ error: makeHttpError({ message: 'invalid' }) }));
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getWishlistsError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('updating a wishlist', () => {
    describe('UpdateWishlist', () => {
      beforeEach(() => {
        store$.dispatch(updateWishlist({ wishlist: wishlists[0] }));
      });

      it('should set loading to true', () => {
        expect(getWishlistsLoading(store$.state)).toBeTrue();
      });
    });

    describe('UpdateWishlistSuccess', () => {
      const updated = {
        ...wishlists[0],
        title: 'new title',
      };
      const updateWishlistSuccessAction = updateWishlistSuccess({
        wishlist: updated,
      });
      const loadWishlistSuccess = loadWishlistsSuccess({ wishlists });

      it('should set loading to false', () => {
        store$.dispatch(updateWishlistSuccessAction);

        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should update wishlist title to new title', () => {
        store$.dispatch(loadWishlistSuccess);
        store$.dispatch(updateWishlistSuccessAction);

        expect(getAllWishlists(store$.state)).toContainEqual(updated);
      });
    });

    describe('UpdateWishlistFail', () => {
      beforeEach(() => {
        store$.dispatch(updateWishlistFail({ error: makeHttpError({ message: 'invalid' }) }));
      });

      it('should set loading to false', () => {
        expect(getWishlistsLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getWishlistsError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('Get Selected Wishlist', () => {
    const loadWishlistsSuccessActions = loadWishlistsSuccess({ wishlists });
    const selectWishlistAction = selectWishlist({ id: wishlists[1].id });

    beforeEach(() => {
      store$.dispatch(loadWishlistsSuccessActions);
      store$.dispatch(selectWishlistAction);
    });

    it('should return correct wishlist id for given id', () => {
      expect(getSelectedWishlistId(store$.state)).toEqual(wishlists[1].id);
    });

    it('should return correct wishlist details for given id', () => {
      expect(getSelectedWishlistDetails(store$.state)).toEqual(wishlists[1]);
    });
  });

  describe('Get Wishlist Details', () => {
    beforeEach(() => {
      store$.dispatch(loadWishlistsSuccess({ wishlists }));
    });

    it('should return correct wishlist for given id', () => {
      expect(getWishlistDetails(store$.state, { id: wishlists[1].id })).toEqual(wishlists[1]);
    });
  });

  describe('Get Preferred Wishlist', () => {
    beforeEach(() => {
      store$.dispatch(loadWishlistsSuccess({ wishlists }));
    });

    it('should return correct wishlist for given title', () => {
      expect(getPreferredWishlist(store$.state)).toEqual(wishlists[0]);
    });
  });
});
