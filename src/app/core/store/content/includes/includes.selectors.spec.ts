import { TestBed } from '@angular/core/testing';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentStoreModule } from 'ish-core/store/content/content-store.module';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadContentIncludeSuccess } from './includes.actions';
import { getContentInclude } from './includes.selectors';

describe('Includes Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContentStoreModule.forTesting('includes'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('getContentInclude', () => {
    it('should select no includes when nothing was reduced', () => {
      expect(getContentInclude('dummy')(store$.state)).toBeUndefined();
    });

    it('should select include when it was successfully loaded', () => {
      store$.dispatch(
        loadContentIncludeSuccess({ include: { id: 'dummy' } as ContentPageletEntryPoint, pagelets: [] })
      );

      expect(getContentInclude('dummy')(store$.state)).toHaveProperty('id', 'dummy');
    });

    describe('loading multiple includes', () => {
      const IDS = ['dummy1', 'dummy2', 'dummy3'];

      beforeEach(() => {
        IDS.forEach(title =>
          store$.dispatch(
            loadContentIncludeSuccess({ include: { id: title } as ContentPageletEntryPoint, pagelets: [] })
          )
        );
      });

      it('should contain all includes when loading multiple items', () => {
        IDS.forEach(includeId => expect(getContentInclude(includeId)(store$.state)).toHaveProperty('id', includeId));
      });

      it('should not contain includes for unrelated ids', () => {
        expect(getContentInclude('unrelated')(store$.state)).toBeUndefined();
      });
    });
  });
});
