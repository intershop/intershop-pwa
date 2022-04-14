import { TestBed } from '@angular/core/testing';

import { ContentPageTreeHelper } from './content-page-tree.helper';
import { ContentPageTreeData } from './content-page-tree.interface';
import { ContentPageTreeMapper } from './content-page-tree.mapper';
import { ContentPageTree, ContentPageTreeElement } from './content-page-tree.model';

describe('Content Page Tree Helper', () => {
  describe('empty()', () => {
    it('should create an empty tree instance when called', () => {
      const empty = ContentPageTreeHelper.empty();
      expect(empty).toBeTruthy();
      expect(empty.nodes).toBeEmpty();
      expect(empty.edges).toBeEmpty();
      expect(empty.rootIds).toBeEmpty();
    });
  });

  describe('single()', () => {
    it('should throw if given element is falsy', () => {
      expect(() => ContentPageTreeHelper.single(undefined)).toThrowError('falsy input');
    });

    it('should throw if given element has no contentPageId', () => {
      const element = {} as ContentPageTreeElement;
      expect(() => ContentPageTreeHelper.single(element)).toThrowError('content tree element has no contentPageId');
    });

    it('should create a tree if a simple root element is put in', () => {
      const element = { contentPageId: 'A', path: ['A'] } as ContentPageTreeElement;
      const tree = ContentPageTreeHelper.single(element);
      expect(tree).toBeTruthy();
      expect(tree.nodes).toEqual({ A: element });
      expect(tree.edges).toBeEmpty();
      expect(tree.rootIds).toEqual(['A']);
    });

    it('should not set root ids when element path was emitted', () => {
      const element = { contentPageId: 'A' } as ContentPageTreeElement;
      const tree = ContentPageTreeHelper.single(element);
      expect(tree).toMatchInlineSnapshot(`
        └─ dangling
           └─ A

      `);
    });

    it('should create a tree from sub elements with edges for element path and no root id', () => {
      const element = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageTreeElement;
      const tree = ContentPageTreeHelper.single(element);
      expect(tree).toBeTruthy();
      expect(tree.edges).toEqual({ A: ['A.1'] });
      expect(tree).toMatchInlineSnapshot(`
        └─ dangling
           └─ A.1

      `);
    });
  });

  describe('add()', () => {
    it('should fail if one of the mandatory inputs is falsy', () => {
      const tree = ContentPageTreeHelper.empty();
      const element = { contentPageId: 'A' } as ContentPageTreeElement;

      expect(() => ContentPageTreeHelper.add(undefined, element)).toThrowError('falsy input');
      expect(() => ContentPageTreeHelper.add(tree, undefined)).toThrowError('falsy input');
    });

    it('should add a node to an empty tree when called', () => {
      const empty = ContentPageTreeHelper.empty();
      const tree = ContentPageTreeHelper.add(empty, {
        contentPageId: 'A',
        path: ['A'],
      } as ContentPageTreeElement);

      expect(tree.edges).toBeEmpty();
      expect(Object.keys(tree.nodes)).toEqual(['A']);
    });

    it('should deep copy element to the tree', () => {
      const element = { contentPageId: 'A' } as ContentPageTreeElement;

      const root = ContentPageTreeHelper.empty();
      const tree = ContentPageTreeHelper.add(root, element);

      expect(tree.nodes.A.contentPageId).toEqual('A');

      element.contentPageId = 'something';

      expect(tree.nodes.A.contentPageId).toEqual('A');
    });

    it('should fail if the supplied element has no contentPageId', () => {
      const tree = ContentPageTreeHelper.empty();
      const element = {} as ContentPageTreeElement;
      expect(() => ContentPageTreeHelper.add(tree, element)).toThrowError('content tree element has no contentPageId');
    });

    it('should add a given element to the tree as additional root', () => {
      const element1 = { contentPageId: 'A', path: ['A'] } as ContentPageTreeElement;
      const element2 = { contentPageId: 'B', path: ['B'] } as ContentPageTreeElement;

      const empty = ContentPageTreeHelper.empty();
      const tree1 = ContentPageTreeHelper.add(empty, element1);
      const tree2 = ContentPageTreeHelper.add(tree1, element2);

      expect(tree2).toMatchInlineSnapshot(`
        ├─ A
        └─ B

      `);
    });

    it('should add a given element to the tree under root using element path', () => {
      const rootElement = { contentPageId: 'A', path: ['A'] } as ContentPageTreeElement;
      const child = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageTreeElement;

      const empty = ContentPageTreeHelper.empty();
      const root = ContentPageTreeHelper.add(empty, rootElement);

      const tree = ContentPageTreeHelper.add(root, child);

      expect(tree).toMatchInlineSnapshot(`
        └─ A
           └─ A.1

      `);
    });

    it('should add two element for the same node to the tree', () => {
      const rootElement = { contentPageId: 'A', path: ['A'] } as ContentPageTreeElement;
      const child1 = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageTreeElement;
      const child2 = { contentPageId: 'A.2', path: ['A', 'A.2'] } as ContentPageTreeElement;

      const empty = ContentPageTreeHelper.empty();
      const tree0 = ContentPageTreeHelper.add(empty, rootElement);
      const tree1 = ContentPageTreeHelper.add(tree0, child1);
      const tree2 = ContentPageTreeHelper.add(tree1, child2);

      expect(tree2).toMatchInlineSnapshot(`
        └─ A
           ├─ A.1
           └─ A.2

      `);
    });

    it('should add two elements hierarchically to the tree', () => {
      const rootElement = { contentPageId: 'A', path: ['A'] } as ContentPageTreeElement;
      const child1 = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageTreeElement;
      const child2 = { contentPageId: 'A.1.a', path: ['A', 'A.1', 'A.1.a'] } as ContentPageTreeElement;

      const empty = ContentPageTreeHelper.empty();
      const tree0 = ContentPageTreeHelper.add(empty, rootElement);
      const tree1 = ContentPageTreeHelper.add(tree0, child1);
      const tree2 = ContentPageTreeHelper.add(tree1, child2);

      expect(tree2).toMatchInlineSnapshot(`
        └─ A
           └─ A.1
              └─ A.1.a

      `);
    });

    it('should handle creation for complex scenarios', () => {
      const rootElement = { contentPageId: 'A', path: ['A'] } as ContentPageTreeElement;
      const child1 = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageTreeElement;
      const child2 = { contentPageId: 'A.1.a', path: ['A', 'A.1', 'A.1.a'] } as ContentPageTreeElement;
      const child3 = { contentPageId: 'A.2', path: ['A', 'A.2'] } as ContentPageTreeElement;
      const child4 = { contentPageId: 'A.1.b', path: ['A', 'A.1', 'A.1.b'] } as ContentPageTreeElement;

      const empty = ContentPageTreeHelper.empty();
      const tree0 = ContentPageTreeHelper.add(empty, rootElement);
      const tree1 = ContentPageTreeHelper.add(tree0, child1);
      const tree2 = ContentPageTreeHelper.add(tree1, child2);
      const tree3 = ContentPageTreeHelper.add(tree2, child3);
      const tree4 = ContentPageTreeHelper.add(tree3, child4);

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
    let treeA: ContentPageTree;
    let treeAB: ContentPageTree;
    let treeAAB: ContentPageTree;
    let treeB: ContentPageTree;

    beforeEach(() => {
      const empty = ContentPageTreeHelper.empty();
      treeA = ContentPageTreeHelper.add(empty, { contentPageId: 'A', path: ['A'] } as ContentPageTreeElement);
      treeAB = ContentPageTreeHelper.add(empty, {
        contentPageId: 'B',
        path: ['A', 'B'],
      } as ContentPageTreeElement);
      treeAAB = ContentPageTreeHelper.merge(treeA, treeAB);
      treeB = ContentPageTreeHelper.add(empty, { contentPageId: 'B', path: ['B'] } as ContentPageTreeElement);
    });

    it('should fail if mandatory falsy arguments are supplied', () => {
      expect(() => ContentPageTreeHelper.merge(undefined, treeAB)).toThrow();
      expect(() => ContentPageTreeHelper.merge(treeA, undefined)).toThrow();
    });

    it('should combine two empty trees to one empty tree when queried', () => {
      const result = ContentPageTreeHelper.merge(ContentPageTreeHelper.empty(), ContentPageTreeHelper.empty());

      expect(result).toEqual(ContentPageTreeHelper.empty());
    });

    it('should do nothing when merging empty trees to a tree', () => {
      const empty = ContentPageTreeHelper.empty();
      const result = ContentPageTreeHelper.merge(treeAAB, empty);

      expect(result).toMatchInlineSnapshot(`
        └─ A
           └─ B

      `);
    });

    it('should return importing tree when merging tree to an empty tree', () => {
      const empty = ContentPageTreeHelper.empty();
      const result = ContentPageTreeHelper.merge(empty, treeAAB);

      expect(result).toMatchInlineSnapshot(`
        └─ A
           └─ B

      `);
    });

    it('should combine simple trees in parallel when queried', () => {
      const combined = ContentPageTreeHelper.merge(treeA, treeB);

      expect(combined).toMatchInlineSnapshot(`
        ├─ A
        └─ B

      `);
    });

    it('should behave like a no-op when merging a tree with itself', () => {
      const combined = ContentPageTreeHelper.merge(treeA, treeA);

      expect(combined).toEqual(treeA);
    });

    it('should combine simple tree as child tree when queried', () => {
      const combined = ContentPageTreeHelper.merge(treeA, treeAB);

      expect(combined).toMatchInlineSnapshot(`
        └─ A
           └─ B

      `);
    });

    it('should handle inserting for complex scenarios', () => {
      treeA = ContentPageTreeHelper.add(treeA, {
        contentPageId: 'A.1',
        path: ['A', 'A.1'],
      } as ContentPageTreeElement);
      treeA = ContentPageTreeHelper.add(treeA, {
        contentPageId: 'A.1.a',
        path: ['A', 'A.1', 'A.1.a'],
      } as ContentPageTreeElement);
      treeA = ContentPageTreeHelper.add(treeA, {
        contentPageId: 'A.2',
        path: ['A', 'A.2'],
      } as ContentPageTreeElement);
      treeA = ContentPageTreeHelper.add(treeA, {
        contentPageId: 'A.1.b',
        path: ['A', 'A.1', 'A.1.b'],
      } as ContentPageTreeElement);

      treeB = ContentPageTreeHelper.add(treeB, {
        contentPageId: 'B.1',
        path: ['B', 'B.1'],
      } as ContentPageTreeElement);
      treeB = ContentPageTreeHelper.add(treeB, {
        contentPageId: 'B.1.a',
        path: ['B', 'B.1', 'B.1.a'],
      } as ContentPageTreeElement);
      treeB = ContentPageTreeHelper.add(treeB, {
        contentPageId: 'B.2',
        path: ['B', 'B.2'],
      } as ContentPageTreeElement);

      const combined = ContentPageTreeHelper.merge(treeA, treeB);

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
      const elABRaw = {
        parent: { itemId: 'A' },
        page: { itemId: 'b' },
        path: [{ itemId: 'A' }],
        type: 'PageTreeRO',
      } as ContentPageTreeData;

      const elARaw = {
        page: { itemId: 'A' },
        type: 'PageTreeRO',
        elements: [
          {
            page: { itemId: 'a' },
            parent: { itemId: 'A' },
            path: [{ itemId: 'A' }],
            type: 'PageTreeRO',
          } as ContentPageTreeData,
          elABRaw,
          {
            parent: { itemId: 'A' },
            page: { itemId: 'c' },
            path: [{ itemId: 'A' }],
            type: 'PageTreeRO',
          } as ContentPageTreeData,
        ],
      } as ContentPageTreeData;

      const elBRaw = { page: { itemId: 'B' }, path: [{ itemId: 'B' }], type: 'PageTreeRO' } as ContentPageTreeData;

      let tree: ContentPageTree;
      let contentPageTreeMapper: ContentPageTreeMapper;

      beforeEach(() => {
        contentPageTreeMapper = TestBed.inject(ContentPageTreeMapper);

        tree = [elARaw, elBRaw].reduce(
          (acc, val) => ContentPageTreeHelper.merge(acc, contentPageTreeMapper.fromData(val)),
          ContentPageTreeHelper.empty()
        );
      });

      it('should be created', () => {
        expect(tree).toMatchInlineSnapshot(`
          ├─ A
          │  ├─ a
          │  ├─ b
          │  └─ c
          └─ B

        `);
        const elAb = tree.nodes.b;
        expect(elAb.path).toEqual(['A', 'b']);
        expect(elAb.name).toBeUndefined();
      });

      describe('with sub element update', () => {
        let elAbUpdateTree: ContentPageTree;

        beforeEach(() => {
          const elAbUpdateRaw = { ...elABRaw, page: { ...elABRaw.page, title: 'update' } };
          elAbUpdateTree = contentPageTreeMapper.fromData(elAbUpdateRaw);
        });

        it('should be created', () => {
          const elAbUpdate = elAbUpdateTree.nodes.b;
          expect(elAbUpdate.name).not.toBeUndefined();
        });

        it('should update element when trees are merged to left', () => {
          const mergeResult = ContentPageTreeHelper.merge(tree, elAbUpdateTree);
          expect(mergeResult.nodes.b.name).not.toBeUndefined();
        });

        it('should update element when trees are merged to right', () => {
          const mergeResult = ContentPageTreeHelper.merge(elAbUpdateTree, tree);
          expect(mergeResult.nodes.b.name).toBeUndefined();
        });

        it('should not change sorting order when merged to left', () => {
          const mergeResult = ContentPageTreeHelper.merge(tree, elAbUpdateTree);
          expect(mergeResult.edges.A).toEqual(['a', 'b', 'c']);
        });

        it('should not change sorting order when merged to right', () => {
          const mergeResult = ContentPageTreeHelper.merge(elAbUpdateTree, tree);
          expect(mergeResult.edges.A).toEqual(['a', 'b', 'c']);
        });
      });
    });
  });
});
