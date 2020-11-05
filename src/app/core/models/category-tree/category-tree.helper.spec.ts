import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CategoryData } from 'ish-core/models/category/category.interface';
import { CategoryMapper } from 'ish-core/models/category/category.mapper';
import { Category } from 'ish-core/models/category/category.model';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { CategoryTreeHelper } from './category-tree.helper';
import { CategoryTree } from './category-tree.model';

describe('Category Tree Helper', () => {
  describe('empty()', () => {
    it('should create an empty tree instance when called', () => {
      const empty = CategoryTreeHelper.empty();
      expect(empty).toBeTruthy();
      expect(empty.rootIds).toBeEmpty();
      expect(empty.nodes).toBeEmpty();
      expect(empty.edges).toBeEmpty();
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
      expect(tree.edges).toBeEmpty();
    });

    it('should not set root ids when category path was omitted', () => {
      const cat = { uniqueId: 'A' } as Category;
      const tree = CategoryTreeHelper.single(cat);
      expect(tree).toMatchInlineSnapshot(`
        └─ dangling
           └─ A

      `);
    });

    it('should create a tree from a subcategory with edges for categoryPath and no root id', () => {
      const cat = { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] } as Category;
      const tree = CategoryTreeHelper.single(cat);
      expect(tree).toBeTruthy();
      expect(tree.edges).toEqual({ A: ['A.1'] });
      expect(tree).toMatchInlineSnapshot(`
        └─ dangling
           └─ A.1

      `);
    });

    it('should create a tree from a subsubsubcategory with edges for categoryPath and no root id', () => {
      const cat = { uniqueId: 'A.1.a.1', categoryPath: ['A', 'A.1', 'A.1.a', 'A.1.a.1'] } as Category;
      const tree = CategoryTreeHelper.single(cat);
      expect(tree).toBeTruthy();
      expect(tree.edges).toEqual({ A: ['A.1'], 'A.1': ['A.1.a'], 'A.1.a': ['A.1.a.1'] });
      expect(tree).toMatchInlineSnapshot(`
        └─ dangling
           └─ A.1.a.1

      `);
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

      expect(tree.edges).toBeEmpty();
      expect(Object.keys(tree.nodes)).toEqual(['A']);
      expect(tree.rootIds).toEqual(['A']);
    });

    it('should deep copy category to the tree', () => {
      const category = { uniqueId: 'A' } as Category;

      const root = CategoryTreeHelper.empty();
      const tree = CategoryTreeHelper.add(root, category);

      expect(tree.nodes.A.uniqueId).toEqual('A');

      category.uniqueId = 'something';

      expect(tree.nodes.A.uniqueId).toEqual('A');
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

      expect(tree2).toMatchInlineSnapshot(`
        ├─ A
        └─ B

      `);
    });

    it('should add a given category to the tree under root using categoryPath', () => {
      const rootCat = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      const child = { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] } as Category;

      const empty = CategoryTreeHelper.empty();
      const root = CategoryTreeHelper.add(empty, rootCat);

      const tree = CategoryTreeHelper.add(root, child);

      expect(tree).toMatchInlineSnapshot(`
        └─ A
           └─ A.1

      `);
    });

    it('should add two categories for the same node to the tree', () => {
      const rootCat = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      const child1 = { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] } as Category;
      const child2 = { uniqueId: 'A.2', categoryPath: ['A', 'A.2'] } as Category;

      const empty = CategoryTreeHelper.empty();
      const tree0 = CategoryTreeHelper.add(empty, rootCat);
      const tree1 = CategoryTreeHelper.add(tree0, child1);
      const tree2 = CategoryTreeHelper.add(tree1, child2);

      expect(tree2).toMatchInlineSnapshot(`
        └─ A
           ├─ A.1
           └─ A.2

      `);
    });

    it('should add two categories hierarchically to the tree', () => {
      const rootCat = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      const child1 = { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] } as Category;
      const child2 = { uniqueId: 'A.1.a', categoryPath: ['A', 'A.1', 'A.1.a'] } as Category;

      const empty = CategoryTreeHelper.empty();
      const tree0 = CategoryTreeHelper.add(empty, rootCat);
      const tree1 = CategoryTreeHelper.add(tree0, child1);
      const tree2 = CategoryTreeHelper.add(tree1, child2);

      expect(tree2).toMatchInlineSnapshot(`
        └─ A
           └─ A.1
              └─ A.1.a

      `);
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

      expect(tree4).toMatchInlineSnapshot(`
        └─ A
           ├─ A.1
           │  ├─ A.1.a
           │  └─ A.1.b
           └─ A.2

      `);
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

      expect(result).toMatchInlineSnapshot(`
        └─ A
           └─ A.B

      `);
    });

    it('should return importing tree when merging tree to an empty tree', () => {
      const empty = CategoryTreeHelper.empty();
      const result = CategoryTreeHelper.merge(empty, treeAAB);

      expect(result).toMatchInlineSnapshot(`
        └─ A
           └─ A.B

      `);
    });

    it('should combine simple trees in parallel when queried', () => {
      const combined = CategoryTreeHelper.merge(treeA, treeB);

      expect(combined).toMatchInlineSnapshot(`
        ├─ A
        └─ B

      `);
    });

    it('should behave like a no-op when merging a tree with itself', () => {
      const combined = CategoryTreeHelper.merge(treeA, treeA);

      expect(combined).toEqual(treeA);
    });

    it('should combine simple tree as child tree when queried', () => {
      const combined = CategoryTreeHelper.merge(treeA, treeAB);

      expect(combined).toMatchInlineSnapshot(`
        └─ A
           └─ A.B

      `);
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

      expect(combined).toMatchInlineSnapshot(`
        ├─ A
        │  ├─ A.1
        │  │  ├─ A.1.a
        │  │  └─ A.1.b
        │  └─ A.2
        └─ B
           ├─ B.1
           │  └─ B.1.a
           └─ B.2

      `);
    });

    describe('sorting order', () => {
      const catAbRaw = { categoryPath: [{ id: 'A' }, { id: 'b' }] } as CategoryData;
      const catARaw = {
        categoryPath: [{ id: 'A' }],
        subCategories: [
          { categoryPath: [{ id: 'A' }, { id: 'a' }] },
          catAbRaw,
          { categoryPath: [{ id: 'A' }, { id: 'c' }] },
        ],
      } as CategoryData;
      const catBRaw = { categoryPath: [{ id: 'B' }] } as CategoryData;
      let tree: CategoryTree;
      let categoryMapper: CategoryMapper;

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [provideMockStore()],
        });
        categoryMapper = TestBed.inject(CategoryMapper);

        tree = [catARaw, catBRaw].reduce(
          (acc, val) => CategoryTreeHelper.merge(acc, categoryMapper.fromData(val)),
          CategoryTreeHelper.empty()
        );
      });

      it('should be created', () => {
        expect(tree).toMatchInlineSnapshot(`
          ├─ A
          │  ├─ A.a
          │  ├─ A.b
          │  └─ A.c
          └─ B

        `);
        const catAb = tree.nodes['A.b'];
        expect(catAb.categoryPath).toEqual(['A', 'A.b']);
        expect(catAb.name).toBeUndefined();
      });

      describe('with sub category update', () => {
        let catAbUpdateTree: CategoryTree;

        beforeEach(() => {
          const catAbUpdateRaw = { ...catAbRaw, name: 'update' };
          catAbUpdateTree = categoryMapper.fromData(catAbUpdateRaw);
          // increase completeness level to always perform an update
          catAbUpdateTree.nodes['A.b'].completenessLevel = tree.nodes['A.b'].completenessLevel + 1;
        });

        it('should be created', () => {
          const catAbUpdate = catAbUpdateTree.nodes['A.b'];
          expect(catAbUpdate.name).not.toBeUndefined();

          expect(catAbUpdateTree.nodes['A.b'].completenessLevel).toBeGreaterThan(tree.nodes['A.b'].completenessLevel);
        });

        it('should update category when trees are merged to left', () => {
          const mergeResult = CategoryTreeHelper.merge(tree, catAbUpdateTree);
          expect(mergeResult.nodes['A.b'].name).not.toBeUndefined();
        });

        it('should update category when trees are merged to right', () => {
          const mergeResult = CategoryTreeHelper.merge(catAbUpdateTree, tree);
          expect(mergeResult.nodes['A.b'].name).not.toBeUndefined();
        });

        it('should not change sorting order when merged to left', () => {
          const mergeResult = CategoryTreeHelper.merge(tree, catAbUpdateTree);
          expect(mergeResult.edges.A).toEqual(['A.a', 'A.b', 'A.c']);
        });

        it('should not change sorting order when merged to right', () => {
          const mergeResult = CategoryTreeHelper.merge(catAbUpdateTree, tree);
          expect(mergeResult.edges.A).toEqual(['A.a', 'A.b', 'A.c']);
        });
      });

      describe('with root category update', () => {
        let catBUpdateTree: CategoryTree;

        beforeEach(() => {
          const catBUpdateRaw = { ...catBRaw, name: 'update' };
          catBUpdateTree = categoryMapper.fromData(catBUpdateRaw);
          // increase completeness level to always perform an update
          catBUpdateTree.nodes.B.completenessLevel = tree.nodes.B.completenessLevel + 1;
        });

        it('should be created', () => {
          const catBUpdate = catBUpdateTree.nodes.B;
          expect(catBUpdate.name).not.toBeUndefined();

          expect(catBUpdateTree.nodes.B.completenessLevel).toBeGreaterThan(tree.nodes.B.completenessLevel);
        });

        it('should update category when trees are merged to left', () => {
          const mergeResult = CategoryTreeHelper.merge(tree, catBUpdateTree);
          expect(mergeResult.nodes.B.name).not.toBeUndefined();
        });

        it('should update category when trees are merged to right', () => {
          const mergeResult = CategoryTreeHelper.merge(catBUpdateTree, tree);
          expect(mergeResult.nodes.B.name).not.toBeUndefined();
        });

        it('should not change sorting order when merged to left', () => {
          const mergeResult = CategoryTreeHelper.merge(tree, catBUpdateTree);
          expect(mergeResult.rootIds).toEqual(['A', 'B']);
        });

        it('should not change sorting order when merged to right', () => {
          const mergeResult = CategoryTreeHelper.merge(catBUpdateTree, tree);
          expect(mergeResult.rootIds).toEqual(['A', 'B']);
        });
      });
    });
  });

  describe('updateStrategy()', () => {
    it.each([
      ['new', 0, 1],
      ['new', 0, 2],
      ['new', 2, 2],
      ['old', 1, 0],
      ['old', 2, 0],
    ])(`should prefer %s one when having completenessLevel %i vs. %i`, (expected, category1CL, category2CL) => {
      const category1 = {
        uniqueId: 'A',
        name: 'old',
        completenessLevel: category1CL,
      } as Category;
      const category2 = {
        uniqueId: 'A',
        name: 'new',
        completenessLevel: category2CL,
      } as Category;

      const result = CategoryTreeHelper.updateStrategy(category1, category2);

      expect(result.name).toEqual(expected);
    });
  });

  describe('subTree', () => {
    let combined: CategoryTree;

    beforeEach(() => {
      combined = categoryTree([
        { uniqueId: 'A', categoryPath: ['A'] },
        { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] },
        { uniqueId: 'A.1.a', categoryPath: ['A', 'A.1', 'A.1.a'] },
        { uniqueId: 'A.2', categoryPath: ['A', 'A.2'] },
        { uniqueId: 'A.1.b', categoryPath: ['A', 'A.1', 'A.1.b'] },
        { uniqueId: 'B', categoryPath: ['B'] },
        { uniqueId: 'B.1', categoryPath: ['B', 'B.1'] },
        { uniqueId: 'B.1.a', categoryPath: ['B', 'B.1', 'B.1.a'] },
        { uniqueId: 'B.2', categoryPath: ['B', 'B.2'] },
      ] as Category[]);
    });

    it('should be created', () => {
      expect(combined).toMatchInlineSnapshot(`
        ├─ A
        │  ├─ A.1
        │  │  ├─ A.1.a
        │  │  └─ A.1.b
        │  └─ A.2
        └─ B
           ├─ B.1
           │  └─ B.1.a
           └─ B.2

      `);

      expect(combined.rootIds).toMatchInlineSnapshot(`
        Array [
          "A",
          "B",
        ]
      `);
      expect(Object.keys(combined.nodes)).toMatchInlineSnapshot(`
        Array [
          "A",
          "A.1",
          "A.1.a",
          "A.2",
          "A.1.b",
          "B",
          "B.1",
          "B.1.a",
          "B.2",
        ]
      `);
      expect(Object.keys(combined.edges)).toMatchInlineSnapshot(`
        Array [
          "A",
          "A.1",
          "B",
          "B.1",
        ]
      `);
    });

    it('should return an empty tree if selected uniqueId is not part of the tree', () => {
      const tree = CategoryTreeHelper.subTree(combined, 'C');
      expect(tree.rootIds).toBeEmpty();
      expect(tree.edges).toBeEmpty();
      expect(tree.nodes).toBeEmpty();
    });

    it('should return copy of tree if selector is undefined', () => {
      const tree = CategoryTreeHelper.subTree(combined, undefined);
      expect(CategoryTreeHelper.equals(tree, combined)).toBeTrue();
    });

    it('should extract sub tree for A', () => {
      const tree = CategoryTreeHelper.subTree(combined, 'A');

      expect(tree).toMatchInlineSnapshot(`
        └─ A
           ├─ A.1
           │  ├─ A.1.a
           │  └─ A.1.b
           └─ A.2

      `);

      expect(tree.rootIds).toMatchInlineSnapshot(`
        Array [
          "A",
        ]
      `);
      expect(Object.keys(tree.nodes)).toMatchInlineSnapshot(`
        Array [
          "A",
          "A.1",
          "A.1.a",
          "A.2",
          "A.1.b",
        ]
      `);
      expect(Object.keys(tree.edges)).toMatchInlineSnapshot(`
        Array [
          "A",
          "A.1",
        ]
      `);
    });

    it('should extract sub tree for A.1', () => {
      const tree = CategoryTreeHelper.subTree(combined, 'A.1');

      expect(tree).toMatchInlineSnapshot(`
        └─ dangling
           └─ A.1
              ├─ A.1.a
              └─ A.1.b

      `);

      expect(tree.rootIds).toBeEmpty();
      expect(Object.keys(tree.nodes)).toMatchInlineSnapshot(`
        Array [
          "A.1",
          "A.1.a",
          "A.1.b",
        ]
      `);
      expect(Object.keys(tree.edges)).toMatchInlineSnapshot(`
        Array [
          "A.1",
        ]
      `);
    });

    it('should extract sub tree for A.1.a', () => {
      const tree = CategoryTreeHelper.subTree(combined, 'A.1.a');

      expect(tree).toMatchInlineSnapshot(`
        └─ dangling
           └─ A.1.a

      `);

      expect(tree.rootIds).toBeEmpty();
      expect(Object.keys(tree.nodes)).toMatchInlineSnapshot(`
        Array [
          "A.1.a",
        ]
      `);
      expect(Object.keys(tree.edges)).toBeEmpty();
    });
  });

  describe('equals', () => {
    const catA = { uniqueId: 'A', categoryPath: ['A'] } as Category;
    const catB = { uniqueId: 'B', categoryPath: ['B'] } as Category;

    it('should return true for simple equal trees', () => {
      const tree1 = categoryTree([catA]);
      const tree2 = categoryTree([catA]);

      expect(CategoryTreeHelper.equals(tree1, tree2)).toBeTrue();
    });

    it('should return true if category was copied', () => {
      const tree1 = categoryTree([catA]);
      const tree2 = categoryTree([{ ...catA }]);

      expect(CategoryTreeHelper.equals(tree1, tree2)).toBeTrue();
    });

    it('should return false for simple unequal trees', () => {
      const tree1 = categoryTree([catA]);
      const tree2 = categoryTree([catB]);

      expect(CategoryTreeHelper.equals(tree1, tree2)).toBeFalse();
    });

    it('should return true for simple unordered trees', () => {
      const tree1 = categoryTree([catA, catB]);
      const tree2 = categoryTree([catB, catA]);

      expect(CategoryTreeHelper.equals(tree1, tree2)).toBeTrue();
    });
  });
});
