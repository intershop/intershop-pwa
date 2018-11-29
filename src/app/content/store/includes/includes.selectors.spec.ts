import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { ContentInclude } from 'ish-core/models/content-include/content-include.model';
import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { contentReducers } from '../content.system';

import { LoadContentIncludeSuccess } from './includes.actions';
import { getContentInclude } from './includes.selectors';

describe('Includes Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        content: combineReducers(contentReducers),
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('getContentInclude', () => {
    it('should select no includes when nothing was reduced', () => {
      expect(getContentInclude(store$.state, 'dummy')).toBeUndefined();
    });

    it('should select include when it was successfully loaded', () => {
      store$.dispatch(new LoadContentIncludeSuccess({ include: { id: 'dummy' } as ContentInclude, pagelets: [] }));

      expect(getContentInclude(store$.state, 'dummy')).toHaveProperty('id', 'dummy');
    });

    describe('loading multiple includes', () => {
      const IDS = ['dummy1', 'dummy2', 'dummy3'];

      beforeEach(() => {
        IDS.forEach(title =>
          store$.dispatch(new LoadContentIncludeSuccess({ include: { id: title } as ContentInclude, pagelets: [] }))
        );
      });

      it('should contain all includes when loading multiple items', () => {
        IDS.forEach(includeId => expect(getContentInclude(store$.state, includeId)).toHaveProperty('id', includeId));
      });

      it('should not contain includes for unrelated ids', () => {
        expect(getContentInclude(store$.state, 'unrelated')).toBeUndefined();
      });
    });
  });
});
