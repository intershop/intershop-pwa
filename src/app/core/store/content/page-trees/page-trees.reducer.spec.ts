import {
  ContentPageletTree,
  ContentPageletTreeElement,
} from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { pageTree } from 'ish-core/utils/dev/test-data-utils';

import { loadContentPageTree, loadContentPageTreeFail, loadContentPageTreeSuccess } from './page-trees.actions';
import { initialState, pageTreesReducer } from './page-trees.reducer';

describe('Page Trees Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as ReturnType<
        typeof loadContentPageTree | typeof loadContentPageTreeSuccess | typeof loadContentPageTreeFail
      >;
      const state = pageTreesReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('Load content page tree actions', () => {
    describe('LoadContentPageTree action', () => {
      it('should set loading to true', () => {
        const action = loadContentPageTree({ contentPageId: '123', depth: '2' });
        const state = pageTreesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadContentPageTreeFail action', () => {
      it('should set loading to false', () => {
        const action = loadContentPageTreeFail({ error: makeHttpError({}) });
        const state = pageTreesReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });

    describe('LoadContentPageTreeSuccess action', () => {
      let tree: ContentPageletTree;

      beforeEach(() => {
        tree = pageTree([
          { uniqueId: '1', contentPageId: '1', path: ['1'] },
          { uniqueId: '1.1', contentPageId: '1.1', path: ['1', '1.1'] },
          { uniqueId: '1.2', contentPageId: '1.2', path: ['1', '1.2'] },
          { uniqueId: '1.1.1', contentPageId: '1.1.1', path: ['1', '1.1', '1.1.1'] },
          { uniqueId: '1.1.2', contentPageId: '1.1.2', path: ['1', '1.1', '1.1.2'] },
          { uniqueId: '1.2.1', contentPageId: '1.2.1', path: ['1', '1.2', '1.2.1'] },
        ] as ContentPageletTreeElement[]);
      });

      it('should insert whole page tree to state', () => {
        const action = loadContentPageTreeSuccess({ tree });
        const state = pageTreesReducer(initialState, action);

        expect(state.trees.rootIds).toHaveLength(1);
        expect(state.trees.rootIds).toEqual(['1']);
        expect(Object.keys(state.trees.nodes)).toHaveLength(6);
        expect(Object.keys(state.trees.nodes)).toEqual(['1', '1.1', '1.2', '1.1.1', '1.1.2', '1.2.1']);
      });
    });
  });
});
