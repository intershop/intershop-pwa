import { TestBed } from '@angular/core/testing';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { TactonProductConfiguration } from '../../models/tacton-product-configuration/tacton-product-configuration.model';
import { TactonStoreModule } from '../tacton-store.module';

import { saveTactonConfigurationReference } from './saved-tacton-configuration.actions';
import { getSavedTactonConfiguration } from './saved-tacton-configuration.selectors';

describe('Saved Tacton Configuration Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('user'),
        TactonStoreModule.forTesting('_savedTactonConfiguration'),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be empty when in initial state', () => {
      expect(getSavedTactonConfiguration('tab/product')(store$.state)).toBeUndefined();
    });
  });

  describe('after saving anonymous reference', () => {
    beforeEach(() => {
      store$.dispatch(
        saveTactonConfigurationReference({
          tactonProduct: 'tab/product',
          user: undefined,
          configuration: {
            configId: 'ABC',
            externalId: 'some',
            steps: [{ name: 'A', current: true }],
          } as TactonProductConfiguration,
        })
      );
    });

    it('should save entity to state', () => {
      expect(getSavedTactonConfiguration('tab/product')(store$.state)).toMatchInlineSnapshot(`
        Object {
          "configId": "ABC",
          "externalId": "some",
          "productId": "tab/product",
          "step": "A",
          "user": "anonymous",
        }
      `);
    });
  });

  describe('after saving reference with logged in user', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ user: { login: 'user@company' } as User, customer: {} as Customer }));
      store$.dispatch(
        saveTactonConfigurationReference({
          tactonProduct: 'tab/product',
          user: 'user@company',
          configuration: {
            configId: 'ABC',
            externalId: 'some',
            steps: [{ name: 'A', current: true }],
          } as TactonProductConfiguration,
        })
      );
    });

    it('should save entity to state', () => {
      expect(getSavedTactonConfiguration('tab/product')(store$.state)).toMatchInlineSnapshot(`
        Object {
          "configId": "ABC",
          "externalId": "some",
          "productId": "tab/product",
          "step": "A",
          "user": "user@company",
        }
      `);
    });
  });
});
