import * as using from 'jasmine-data-provider';
import { Category } from '../category/category.model';
import { CategoryTreeHelper } from './category-tree.helper';
import { CategoryTree } from './category-tree.model';

describe('CategoryTreeHelper', () => {
  describe('empty()', () => {
    it('should create an empty tree instance when called', () => {
      const empty = CategoryTreeHelper.empty();
      expect(empty).toBeTruthy();
      expect(empty.rootIds).toEqual([]);
      expect(empty.nodes).toEqual({});
      expect(empty.edges).toEqual({});
      expect(empty.ids).toEqual([]);
    });
  });

  describe('single()', () => {
    it('should throw if given category is falsy', () => {
      expect(() => CategoryTreeHelper.single(undefined)).toThrowError('falsy input');
    });

    it('should throw if given category has no uniqueId', () => {
      const cat = {} as Category;
      expect(() => CategoryTreeHelper.single(cat)).toThrowError('category has no uniqueId');
    });

    it('should create a tree if a simple root category is put in', () => {
      const cat = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      const tree = CategoryTreeHelper.single(cat);
      expect(tree).toBeTruthy();
      expect(tree.rootIds).toEqual(['A']);
      expect(tree.nodes).toEqual({ A: cat });
      expect(tree.edges).toEqual({});
      expect(tree.ids).toEqual(['A']);
    });

    it('should not set root ids when category path was omitted', () => {
      const cat = { uniqueId: 'A' } as Category;
      const tree = CategoryTreeHelper.single(cat);
      expect(tree).toBeTruthy();
      expect(tree.rootIds).toEqual([]);
      expect(tree.nodes).toEqual({ A: cat });
      expect(tree.edges).toEqual({});
      expect(tree.ids).toEqual(['A']);
    });

    it('should create a tree from a subcategory with edges for categoryPath and no root id', () => {
      const cat = { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] } as Category;
      const tree = CategoryTreeHelper.single(cat);
      expect(tree).toBeTruthy();
      expect(tree.rootIds).toEqual([]);
      expect(tree.nodes).toEqual({ 'A.1': cat });
      expect(tree.ids).toEqual(['A.1']);
      expect(tree.edges).toEqual({ A: ['A.1'] });
    });

    it('should create a tree from a subsubsubcategory with edges for categoryPath and no root id', () => {
      const cat = { uniqueId: 'A.1.a.1', categoryPath: ['A', 'A.1', 'A.1.a', 'A.1.a.1'] } as Category;
      const tree = CategoryTreeHelper.single(cat);
      expect(tree).toBeTruthy();
      expect(tree.rootIds).toEqual([]);
      expect(tree.nodes).toEqual({ 'A.1.a.1': cat });
      expect(tree.ids).toEqual(['A.1.a.1']);
      expect(tree.edges).toEqual({ A: ['A.1'], 'A.1': ['A.1.a'], 'A.1.a': ['A.1.a.1'] });
    });
  });

  describe('add()', () => {
    it('should fail if one of the mandatory inputs is falsy', () => {
      const tree = CategoryTreeHelper.empty();
      const cat = { uniqueId: 'A' } as Category;

      expect(() => CategoryTreeHelper.add(undefined, cat)).toThrowError('falsy input');
      expect(() => CategoryTreeHelper.add(tree, undefined)).toThrowError('falsy input');
    });

    it('should add a node to an empty tree when called', () => {
      const empty = CategoryTreeHelper.empty();
      const tree = CategoryTreeHelper.add(empty, { uniqueId: 'A', categoryPath: ['A'] } as Category);

      expect(tree.ids).toEqual(['A']);
      expect(tree.edges).toEqual({});
      expect(Object.keys(tree.nodes)).toEqual(['A']);
      expect(tree.rootIds).toEqual(['A']);
    });

    it('should deep copy category to the tree', () => {
      const category = { uniqueId: 'A' } as Category;

      const root = CategoryTreeHelper.empty();
      const tree = CategoryTreeHelper.add(root, category);

      expect(tree.nodes['A'].uniqueId).toEqual('A');

      category.uniqueId = 'something';

      expect(tree.nodes['A'].uniqueId).toEqual('A');
    });

    it('should fail if the supplied category has no uniqueId', () => {
      const tree = CategoryTreeHelper.empty();
      const cat = {} as Category;
      expect(() => CategoryTreeHelper.add(tree, cat)).toThrowError('category has no uniqueId');
    });

    it('should add a given category to the tree as additional root when not supplied with optional parameter', () => {
      const cat1 = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      const cat2 = { uniqueId: 'B', categoryPath: ['B'] } as Category;

      const empty = CategoryTreeHelper.empty();
      const tree1 = CategoryTreeHelper.add(empty, cat1);
      const tree2 = CategoryTreeHelper.add(tree1, cat2);

      expect(tree2.ids).toEqual(['A', 'B']);
      expect(tree2.edges).toEqual({});
      expect(Object.keys(tree2.nodes)).toEqual(['A', 'B']);
      expect(tree2.rootIds).toEqual(['A', 'B']);
    });

    it('should add a given category to the tree under root using categoryPath', () => {
      const rootCat = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      const child = { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] } as Category;

      const empty = CategoryTreeHelper.empty();
      const root = CategoryTreeHelper.add(empty, rootCat);

      const tree = CategoryTreeHelper.add(root, child);

      expect(tree.ids).toEqual(['A', 'A.1']);
      expect(tree.edges).toEqual({ A: ['A.1'] });
      expect(Object.keys(tree.nodes)).toEqual(['A', 'A.1']);
      expect(tree.rootIds).toEqual(['A']);
    });

    it('should add two categories for the same node to the tree', () => {
      const rootCat = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      const child1 = { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] } as Category;
      const child2 = { uniqueId: 'A.2', categoryPath: ['A', 'A.2'] } as Category;

      const empty = CategoryTreeHelper.empty();
      const tree0 = CategoryTreeHelper.add(empty, rootCat);
      const tree1 = CategoryTreeHelper.add(tree0, child1);
      const tree2 = CategoryTreeHelper.add(tree1, child2);

      expect(tree2.ids).toEqual(['A', 'A.1', 'A.2']);
      expect(tree2.edges).toEqual({ A: ['A.1', 'A.2'] });
      expect(Object.keys(tree2.nodes)).toEqual(['A', 'A.1', 'A.2']);
      expect(tree2.rootIds).toEqual(['A']);
    });

    it('should add two categories hierarchically to the tree', () => {
      const rootCat = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      const child1 = { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] } as Category;
      const child2 = { uniqueId: 'A.1.a', categoryPath: ['A', 'A.1', 'A.1.a'] } as Category;

      const empty = CategoryTreeHelper.empty();
      const tree0 = CategoryTreeHelper.add(empty, rootCat);
      const tree1 = CategoryTreeHelper.add(tree0, child1);
      const tree2 = CategoryTreeHelper.add(tree1, child2);

      expect(tree2.ids).toEqual(['A', 'A.1', 'A.1.a']);
      expect(tree2.edges).toEqual({ A: ['A.1'], 'A.1': ['A.1.a'] });
      expect(Object.keys(tree2.nodes)).toEqual(['A', 'A.1', 'A.1.a']);
      expect(tree2.rootIds).toEqual(['A']);
    });

    it('should handle creation for complex scenarios', () => {
      const rootCat = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      const child1 = { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] } as Category;
      const child2 = { uniqueId: 'A.1.a', categoryPath: ['A', 'A.1', 'A.1.a'] } as Category;
      const child3 = { uniqueId: 'A.2', categoryPath: ['A', 'A.2'] } as Category;
      const child4 = { uniqueId: 'A.1.b', categoryPath: ['A', 'A.1', 'A.1.b'] } as Category;

      const empty = CategoryTreeHelper.empty();
      const tree0 = CategoryTreeHelper.add(empty, rootCat);
      const tree1 = CategoryTreeHelper.add(tree0, child1);
      const tree2 = CategoryTreeHelper.add(tree1, child2);
      const tree3 = CategoryTreeHelper.add(tree2, child3);
      const tree4 = CategoryTreeHelper.add(tree3, child4);

      expect(tree4.ids).toEqual(['A', 'A.1', 'A.1.a', 'A.2', 'A.1.b']);
      expect(tree4.edges).toEqual({ A: ['A.1', 'A.2'], 'A.1': ['A.1.a', 'A.1.b'] });
      expect(Object.keys(tree4.nodes)).toEqual(['A', 'A.1', 'A.1.a', 'A.2', 'A.1.b']);
      expect(tree4.rootIds).toEqual(['A']);
    });
  });

  describe('merge()', () => {
    let treeA: CategoryTree;
    let treeAB: CategoryTree;
    let treeAAB: CategoryTree;
    let treeB: CategoryTree;

    beforeEach(() => {
      const empty = CategoryTreeHelper.empty();
      treeA = CategoryTreeHelper.add(empty, { uniqueId: 'A', categoryPath: ['A'] } as Category);
      treeAB = CategoryTreeHelper.add(empty, { uniqueId: 'A.B', categoryPath: ['A', 'A.B'] } as Category);
      treeAAB = CategoryTreeHelper.merge(treeA, treeAB);
      treeB = CategoryTreeHelper.add(empty, { uniqueId: 'B', categoryPath: ['B'] } as Category);
    });

    it('should fail if mandatory falsy arguments are supplied', () => {
      expect(() => CategoryTreeHelper.merge(undefined, treeAB)).toThrow();
      expect(() => CategoryTreeHelper.merge(treeA, undefined)).toThrow();
    });

    it('should combine two empty trees to one empty tree when queried', () => {
      const result = CategoryTreeHelper.merge(CategoryTreeHelper.empty(), CategoryTreeHelper.empty());

      expect(result).toEqual(CategoryTreeHelper.empty());
    });

    it('should do nothing when merging empty trees to a tree', () => {
      const empty = CategoryTreeHelper.empty();
      const result = CategoryTreeHelper.merge(treeAAB, empty);

      expect(result.ids).toEqual(['A', 'A.B']);
      expect(Object.keys(result.nodes)).toEqual(['A', 'A.B']);
      expect(result.edges).toEqual({ A: ['A.B'] });
      expect(result.rootIds).toEqual(['A']);
    });

    it('should return importing tree when merging tree to an empty tree', () => {
      const empty = CategoryTreeHelper.empty();
      const result = CategoryTreeHelper.merge(empty, treeAAB);

      expect(result.ids).toEqual(['A', 'A.B']);
      expect(Object.keys(result.nodes)).toEqual(['A', 'A.B']);
      expect(result.edges).toEqual({ A: ['A.B'] });
      expect(result.rootIds).toEqual(['A']);
    });

    it('should combine simple trees in parallel when queried', () => {
      const combined = CategoryTreeHelper.merge(treeA, treeB);

      expect(combined.ids).toEqual(['A', 'B']);
      expect(Object.keys(combined.nodes)).toEqual(['A', 'B']);
      expect(combined.edges).toEqual({});
      expect(combined.rootIds).toEqual(['A', 'B']);
    });

    it('should behave like a no-op when merging a tree with itself', () => {
      const combined = CategoryTreeHelper.merge(treeA, treeA);

      expect(combined).toEqual(treeA);
    });

    it('should combine simple tree as child tree when queried', () => {
      const combined = CategoryTreeHelper.merge(treeA, treeAB);

      expect(combined.ids).toEqual(['A', 'A.B']);
      expect(Object.keys(combined.nodes)).toEqual(['A', 'A.B']);
      expect(combined.edges).toEqual({ A: ['A.B'] });
      expect(combined.rootIds).toEqual(['A']);
    });

    it('should handle inserting for complex scenarios', () => {
      treeA = CategoryTreeHelper.add(treeA, { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] } as Category);
      treeA = CategoryTreeHelper.add(treeA, {
        uniqueId: 'A.1.a',
        categoryPath: ['A', 'A.1', 'A.1.a'],
      } as Category);
      treeA = CategoryTreeHelper.add(treeA, { uniqueId: 'A.2', categoryPath: ['A', 'A.2'] } as Category);
      treeA = CategoryTreeHelper.add(treeA, {
        uniqueId: 'A.1.b',
        categoryPath: ['A', 'A.1', 'A.1.b'],
      } as Category);

      treeB = CategoryTreeHelper.add(treeB, { uniqueId: 'B.1', categoryPath: ['B', 'B.1'] } as Category);
      treeB = CategoryTreeHelper.add(treeB, {
        uniqueId: 'B.1.a',
        categoryPath: ['B', 'B.1', 'B.1.a'],
      } as Category);
      treeB = CategoryTreeHelper.add(treeB, { uniqueId: 'B.2', categoryPath: ['B', 'B.2'] } as Category);

      const combined = CategoryTreeHelper.merge(treeA, treeB);

      expect(combined.ids).toEqual(['A', 'A.1', 'A.1.a', 'A.2', 'A.1.b', 'B', 'B.1', 'B.1.a', 'B.2']);
      expect(combined.edges).toEqual({
        A: ['A.1', 'A.2'],
        'A.1': ['A.1.a', 'A.1.b'],
        B: ['B.1', 'B.2'],
        'B.1': ['B.1.a'],
      });
      expect(combined.rootIds).toEqual(['A', 'B']);
    });
  });
  describe('updateStrategy()', () => {
    using(
      [
        { category1CL: undefined, category2CL: true, expected: 'new' },
        { category1CL: undefined, category2CL: undefined, expected: 'new' },
        { category1CL: true, category2CL: true, expected: 'new' },
        { category1CL: true, category2CL: undefined, expected: 'old' },
      ],
      slice => {
        it(`should prefer ${slice.expected} one when having ${slice.category1CL} and incoming ${
          slice.category2CL
        }`, () => {
          const category1 = { uniqueId: 'A', name: 'old', completelyLoaded: slice.category1CL } as Category;
          const category2 = { uniqueId: 'A', name: 'new', completelyLoaded: slice.category2CL } as Category;

          const result = CategoryTreeHelper.updateStrategy(category1, category2);

          expect(result.name).toEqual(slice.expected);
        });
      }
    );
  });
});
