import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import { assignBuyingContextSuccess } from './buying-context.actions';
import { getBuyingContext } from './buying-context.selectors';

describe('Buying Context Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), OrganizationHierarchiesStoreModule.forTesting('buyingContext')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not have entities when in initial state', () => {
      expect(getBuyingContext(store$.state)).toBeEmpty();
    });
  });

  describe('get BuyingContext', () => {
    beforeEach(() => {
      store$.dispatch(
        assignBuyingContextSuccess({ group: { name: 'Anna', id: 'Aaron' } as OrganizationGroup, bctx: 'Anna@Aaron' })
      );
    });

    it('should always return the assigned buying context', () => {
      expect(getBuyingContext(store$.state)).toMatchInlineSnapshot(`
        {
          "bctx": "Anna@Aaron",
          "group": {
            "id": "Aaron",
            "name": "Anna",
          },
        }
      `);
    });
  });
});
