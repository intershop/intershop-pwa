import { TestBed } from '@angular/core/testing';

import { ContentPageletTreeHelper } from './content-pagelet-tree.helper';
import { ContentPageletTreeData } from './content-pagelet-tree.interface';
import { ContentPageletTreeMapper } from './content-pagelet-tree.mapper';
import { ContentPageletTree, ContentPageletTreeElement } from './content-pagelet-tree.model';

describe('Content Pagelet Tree Helper', () => {
  describe('empty()', () => {
    it('should create an empty tree instance when called', () => {
      const empty = ContentPageletTreeHelper.empty();
      expect(empty).toBeTruthy();
      expect(empty.nodes).toBeEmpty();
      expect(empty.edges).toBeEmpty();
      expect(empty.rootIds).toBeEmpty();
    });
  });

  describe('single()', () => {
    it('should throw if given element is falsy', () => {
      expect(() => ContentPageletTreeHelper.single(undefined)).toThrowError('falsy input');
    });

    it('should throw if given element has no contentPageId', () => {
      const element = {} as ContentPageletTreeElement;
      expect(() => ContentPageletTreeHelper.single(element)).toThrowError('content tree element has no contentPageId');
    });

    it('should create a tree if a simple root element is put in', () => {
      const element = { contentPageId: 'A', path: ['A'] } as ContentPageletTreeElement;
      const tree = ContentPageletTreeHelper.single(element);
      expect(tree).toBeTruthy();
      expect(tree.nodes).toEqual({ A: element });
      expect(tree.edges).toBeEmpty();
      expect(tree.rootIds).toEqual(['A']);
    });

    it('should not set root ids when element path was emitted', () => {
      const element = { contentPageId: 'A' } as ContentPageletTreeElement;
      const tree = ContentPageletTreeHelper.single(element);
      expect(tree).toMatchInlineSnapshot(`
        └─ dangling
           └─ A

      `);
    });

    it('should create a tree from sub elements with edges for element path and no root id', () => {
      const element = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageletTreeElement;
      const tree = ContentPageletTreeHelper.single(element);
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
      const tree = ContentPageletTreeHelper.empty();
      const element = { contentPageId: 'A' } as ContentPageletTreeElement;

      expect(() => ContentPageletTreeHelper.add(undefined, element)).toThrowError('falsy input');
      expect(() => ContentPageletTreeHelper.add(tree, undefined)).toThrowError('falsy input');
    });

    it('should add a node to an empty tree when called', () => {
      const empty = ContentPageletTreeHelper.empty();
      const tree = ContentPageletTreeHelper.add(empty, {
        contentPageId: 'A',
        path: ['A'],
      } as ContentPageletTreeElement);

      expect(tree.edges).toBeEmpty();
      expect(Object.keys(tree.nodes)).toEqual(['A']);
    });

    it('should deep copy element to the tree', () => {
      const element = { contentPageId: 'A' } as ContentPageletTreeElement;

      const root = ContentPageletTreeHelper.empty();
      const tree = ContentPageletTreeHelper.add(root, element);

      expect(tree.nodes.A.contentPageId).toEqual('A');

      element.contentPageId = 'something';

      expect(tree.nodes.A.contentPageId).toEqual('A');
    });

    it('should fail if the supplied element has no contentPageId', () => {
      const tree = ContentPageletTreeHelper.empty();
      const element = {} as ContentPageletTreeElement;
      expect(() => ContentPageletTreeHelper.add(tree, element)).toThrowError(
        'content tree element has no contentPageId'
      );
    });

    it('should add a given element to the tree as additional root', () => {
      const element1 = { contentPageId: 'A', path: ['A'] } as ContentPageletTreeElement;
      const element2 = { contentPageId: 'B', path: ['B'] } as ContentPageletTreeElement;

      const empty = ContentPageletTreeHelper.empty();
      const tree1 = ContentPageletTreeHelper.add(empty, element1);
      const tree2 = ContentPageletTreeHelper.add(tree1, element2);

      expect(tree2).toMatchInlineSnapshot(`
        ├─ A
        └─ B

      `);
    });

    it('should add a given element to the tree under root using element path', () => {
      const rootElement = { contentPageId: 'A', path: ['A'] } as ContentPageletTreeElement;
      const child = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageletTreeElement;

      const empty = ContentPageletTreeHelper.empty();
      const root = ContentPageletTreeHelper.add(empty, rootElement);

      const tree = ContentPageletTreeHelper.add(root, child);

      expect(tree).toMatchInlineSnapshot(`
        └─ A
           └─ A.1

      `);
    });

    it('should add two element for the same node to the tree', () => {
      const rootElement = { contentPageId: 'A', path: ['A'] } as ContentPageletTreeElement;
      const child1 = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageletTreeElement;
      const child2 = { contentPageId: 'A.2', path: ['A', 'A.2'] } as ContentPageletTreeElement;

      const empty = ContentPageletTreeHelper.empty();
      const tree0 = ContentPageletTreeHelper.add(empty, rootElement);
      const tree1 = ContentPageletTreeHelper.add(tree0, child1);
      const tree2 = ContentPageletTreeHelper.add(tree1, child2);

      expect(tree2).toMatchInlineSnapshot(`
        └─ A
           ├─ A.1
           └─ A.2

      `);
    });

    it('should add two elements hierarchically to the tree', () => {
      const rootElement = { contentPageId: 'A', path: ['A'] } as ContentPageletTreeElement;
      const child1 = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageletTreeElement;
      const child2 = { contentPageId: 'A.1.a', path: ['A', 'A.1', 'A.1.a'] } as ContentPageletTreeElement;

      const empty = ContentPageletTreeHelper.empty();
      const tree0 = ContentPageletTreeHelper.add(empty, rootElement);
      const tree1 = ContentPageletTreeHelper.add(tree0, child1);
      const tree2 = ContentPageletTreeHelper.add(tree1, child2);

      expect(tree2).toMatchInlineSnapshot(`
        └─ A
           └─ A.1
              └─ A.1.a

      `);
    });

    it('should handle creation for complex scenarios', () => {
      const rootElement = { contentPageId: 'A', path: ['A'] } as ContentPageletTreeElement;
      const child1 = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageletTreeElement;
      const child2 = { contentPageId: 'A.1.a', path: ['A', 'A.1', 'A.1.a'] } as ContentPageletTreeElement;
      const child3 = { contentPageId: 'A.2', path: ['A', 'A.2'] } as ContentPageletTreeElement;
      const child4 = { contentPageId: 'A.1.b', path: ['A', 'A.1', 'A.1.b'] } as ContentPageletTreeElement;

      const empty = ContentPageletTreeHelper.empty();
      const tree0 = ContentPageletTreeHelper.add(empty, rootElement);
      const tree1 = ContentPageletTreeHelper.add(tree0, child1);
      const tree2 = ContentPageletTreeHelper.add(tree1, child2);
      const tree3 = ContentPageletTreeHelper.add(tree2, child3);
      const tree4 = ContentPageletTreeHelper.add(tree3, child4);

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
    let treeA: ContentPageletTree;
    let treeAB: ContentPageletTree;
    let treeAAB: ContentPageletTree;
    let treeB: ContentPageletTree;

    beforeEach(() => {
      const empty = ContentPageletTreeHelper.empty();
      treeA = ContentPageletTreeHelper.add(empty, { contentPageId: 'A', path: ['A'] } as ContentPageletTreeElement);
      treeAB = ContentPageletTreeHelper.add(empty, {
        contentPageId: 'B',
        path: ['A', 'B'],
      } as ContentPageletTreeElement);
      treeAAB = ContentPageletTreeHelper.merge(treeA, treeAB);
      treeB = ContentPageletTreeHelper.add(empty, { contentPageId: 'B', path: ['B'] } as ContentPageletTreeElement);
    });

    it('should fail if mandatory falsy arguments are supplied', () => {
      expect(() => ContentPageletTreeHelper.merge(undefined, treeAB)).toThrow();
      expect(() => ContentPageletTreeHelper.merge(treeA, undefined)).toThrow();
    });

    it('should combine two empty trees to one empty tree when queried', () => {
      const result = ContentPageletTreeHelper.merge(ContentPageletTreeHelper.empty(), ContentPageletTreeHelper.empty());

      expect(result).toEqual(ContentPageletTreeHelper.empty());
    });

    it('should do nothing when merging empty trees to a tree', () => {
      const empty = ContentPageletTreeHelper.empty();
      const result = ContentPageletTreeHelper.merge(treeAAB, empty);

      expect(result).toMatchInlineSnapshot(`
        └─ A
           └─ B

      `);
    });

    it('should return importing tree when merging tree to an empty tree', () => {
      const empty = ContentPageletTreeHelper.empty();
      const result = ContentPageletTreeHelper.merge(empty, treeAAB);

      expect(result).toMatchInlineSnapshot(`
        └─ A
           └─ B

      `);
    });

    it('should combine simple trees in parallel when queried', () => {
      const combined = ContentPageletTreeHelper.merge(treeA, treeB);

      expect(combined).toMatchInlineSnapshot(`
        ├─ A
        └─ B

      `);
    });

    it('should behave like a no-op when merging a tree with itself', () => {
      const combined = ContentPageletTreeHelper.merge(treeA, treeA);

      expect(combined).toEqual(treeA);
    });

    it('should combine simple tree as child tree when queried', () => {
      const combined = ContentPageletTreeHelper.merge(treeA, treeAB);

      expect(combined).toMatchInlineSnapshot(`
        └─ A
           └─ B

      `);
    });

    it('should handle inserting for complex scenarios', () => {
      treeA = ContentPageletTreeHelper.add(treeA, {
        contentPageId: 'A.1',
        path: ['A', 'A.1'],
      } as ContentPageletTreeElement);
      treeA = ContentPageletTreeHelper.add(treeA, {
        contentPageId: 'A.1.a',
        path: ['A', 'A.1', 'A.1.a'],
      } as ContentPageletTreeElement);
      treeA = ContentPageletTreeHelper.add(treeA, {
        contentPageId: 'A.2',
        path: ['A', 'A.2'],
      } as ContentPageletTreeElement);
      treeA = ContentPageletTreeHelper.add(treeA, {
        contentPageId: 'A.1.b',
        path: ['A', 'A.1', 'A.1.b'],
      } as ContentPageletTreeElement);

      treeB = ContentPageletTreeHelper.add(treeB, {
        contentPageId: 'B.1',
        path: ['B', 'B.1'],
      } as ContentPageletTreeElement);
      treeB = ContentPageletTreeHelper.add(treeB, {
        contentPageId: 'B.1.a',
        path: ['B', 'B.1', 'B.1.a'],
      } as ContentPageletTreeElement);
      treeB = ContentPageletTreeHelper.add(treeB, {
        contentPageId: 'B.2',
        path: ['B', 'B.2'],
      } as ContentPageletTreeElement);

      const combined = ContentPageletTreeHelper.merge(treeA, treeB);

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
      } as ContentPageletTreeData;

      const elARaw = {
        page: { itemId: 'A' },
        type: 'PageTreeRO',
        elements: [
          {
            page: { itemId: 'a' },
            parent: { itemId: 'A' },
            path: [{ itemId: 'A' }],
            type: 'PageTreeRO',
          } as ContentPageletTreeData,
          elABRaw,
          {
            parent: { itemId: 'A' },
            page: { itemId: 'c' },
            path: [{ itemId: 'A' }],
            type: 'PageTreeRO',
          } as ContentPageletTreeData,
        ],
      } as ContentPageletTreeData;

      const elBRaw = { page: { itemId: 'B' }, path: [{ itemId: 'B' }], type: 'PageTreeRO' } as ContentPageletTreeData;

      let tree: ContentPageletTree;
      let contentPageletTreeMapper: ContentPageletTreeMapper;

      beforeEach(() => {
        TestBed.configureTestingModule({});
        contentPageletTreeMapper = TestBed.inject(ContentPageletTreeMapper);

        tree = [elARaw, elBRaw].reduce(
          (acc, val) => ContentPageletTreeHelper.merge(acc, contentPageletTreeMapper.fromData(val)),
          ContentPageletTreeHelper.empty()
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
        let elAbUpdateTree: ContentPageletTree;

        beforeEach(() => {
          const elAbUpdateRaw = { ...elABRaw, page: { ...elABRaw.page, title: 'update' } };
          elAbUpdateTree = contentPageletTreeMapper.fromData(elAbUpdateRaw);
        });

        it('should be created', () => {
          const elAbUpdate = elAbUpdateTree.nodes.b;
          expect(elAbUpdate.name).not.toBeUndefined();
        });

        it('should update element when trees are merged to left', () => {
          const mergeResult = ContentPageletTreeHelper.merge(tree, elAbUpdateTree);
          expect(mergeResult.nodes.b.name).not.toBeUndefined();
        });

        it('should update element when trees are merged to right', () => {
          const mergeResult = ContentPageletTreeHelper.merge(elAbUpdateTree, tree);
          expect(mergeResult.nodes.b.name).toBeUndefined();
        });

        it('should not change sorting order when merged to left', () => {
          const mergeResult = ContentPageletTreeHelper.merge(tree, elAbUpdateTree);
          expect(mergeResult.edges.A).toEqual(['a', 'b', 'c']);
        });

        it('should not change sorting order when merged to right', () => {
          const mergeResult = ContentPageletTreeHelper.merge(elAbUpdateTree, tree);
          expect(mergeResult.edges.A).toEqual(['a', 'b', 'c']);
        });
      });
    });
  });
});
