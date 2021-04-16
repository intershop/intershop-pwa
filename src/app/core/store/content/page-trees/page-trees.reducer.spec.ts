import { ContentPageTree, ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';
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
    describe('LoadContentPageTreeSuccess action', () => {
      let tree1: ContentPageTree;
      let tree11: ContentPageTree;
      let tree2: ContentPageTree;

      beforeEach(() => {
        tree1 = pageTree([
          { contentPageId: '1', path: ['1'] },
          { contentPageId: '1.1', path: ['1', '1.1'] },
          { contentPageId: '1.2', path: ['1', '1.2'] },
          { contentPageId: '1.1.1', path: ['1', '1.1', '1.1.1'] },
          { contentPageId: '1.1.2', path: ['1', '1.1', '1.1.2'] },
          { contentPageId: '1.2.1', path: ['1', '1.2', '1.2.1'] },
        ] as ContentPageTreeElement[]);

        tree11 = pageTree([
          { contentPageId: '1', path: ['1'] },
          { contentPageId: '1.1', path: ['1', '1.1'] },
          { contentPageId: '1.1.1', path: ['1', '1.1', '1.1.1'] },
          { contentPageId: '1.1.2', path: ['1', '1.1', '1.1.2'] },
        ] as ContentPageTreeElement[]);

        tree2 = pageTree([
          { contentPageId: '2', path: ['2'] },
          { contentPageId: '2.1', path: ['2', '2.1'] },
          { contentPageId: '2.2', path: ['2', '2.2'] },
        ] as ContentPageTreeElement[]);
      });

      it('should insert whole page tree to state', () => {
        const action = loadContentPageTreeSuccess({ tree: tree1 });
        const state = pageTreesReducer(initialState, action);

        expect(Object.keys(state.trees.nodes)).toHaveLength(6);
        expect(Object.keys(state.trees.nodes)).toEqual(['1', '1.1', '1.2', '1.1.1', '1.1.2', '1.2.1']);
      });

      it('should merge the new tree to state', () => {
        const action1 = loadContentPageTreeSuccess({ tree: tree11 });
        const state1 = pageTreesReducer(initialState, action1);

        expect(Object.keys(state1.trees.nodes)).toHaveLength(4);
        expect(Object.keys(state1.trees.nodes)).toEqual(['1', '1.1', '1.1.1', '1.1.2']);

        const action2 = loadContentPageTreeSuccess({ tree: tree1 });
        const state2 = pageTreesReducer(state1, action2);

        expect(Object.keys(state2.trees.nodes)).toHaveLength(6);
        expect(Object.keys(state2.trees.nodes)).toEqual(['1', '1.1', '1.1.1', '1.1.2', '1.2', '1.2.1']);
      });

      it('should add the new tree to state when rootId does not exists', () => {
        const action1 = loadContentPageTreeSuccess({ tree: tree1 });
        const state1 = pageTreesReducer(initialState, action1);

        expect(state1.trees.rootIds).toHaveLength(1);

        const action2 = loadContentPageTreeSuccess({ tree: tree2 });
        const state2 = pageTreesReducer(state1, action2);

        expect(state2.trees.rootIds).toHaveLength(2);
      });

      it('should do nothing when action does not have a tree', () => {
        const action1 = loadContentPageTreeSuccess({ tree: tree1 });
        const state1 = pageTreesReducer(initialState, action1);
        const action2 = loadContentPageTreeSuccess({ tree: undefined });
        const state2 = pageTreesReducer(state1, action2);

        expect(state2.trees).toEqual(state2.trees);
      });
    });
  });
});
