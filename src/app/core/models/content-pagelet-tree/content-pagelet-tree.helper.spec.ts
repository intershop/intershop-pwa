

import { ContentPageletTreeHelper } from './content-pagelet-tree.helper';
import { ContentPageletTree, ContentPageletTreeElement } from './content-pagelet-tree.model';

describe('Content Pagelet Tree Helper', () => {
  describe('empty()', () => {
    it('should create an empty tree instance when called', () => {
      const empty = ContentPageletTreeHelper.empty();
      expect(empty).toBeTruthy();
      expect(empty.nodes).toBeEmpty();
      expect(empty.edges).toBeEmpty();
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
    });

    it('should not set root ids when element path was emitted', () => {
      const element = { contentPageId: 'A' } as ContentPageletTreeElement;
      const tree = ContentPageletTreeHelper.single(element);
      expect(tree).toMatchInlineSnapshot(`
        Object {
          "edges": Object {},
          "nodes": Object {
            "A": Object {
              "contentPageId": "A",
            },
          },
        }
      `);
    });

    it('should create a tree from subelements with edges for element path and no root id', () => {
      const element = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageletTreeElement;
      const tree = ContentPageletTreeHelper.single(element);
      expect(tree).toBeTruthy();
      expect(tree.edges).toEqual({ A: ['A.1'] });
      expect(tree).toMatchInlineSnapshot(`
        Object {
          "edges": Object {
            "A": Array [
              "A.1",
            ],
          },
          "nodes": Object {
            "A.1": Object {
              "contentPageId": "A.1",
              "path": Array [
                "A",
                "A.1",
              ],
            },
          },
        }
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

    it('should add a given category to the tree as additional root when not supplied with optional parameter', () => {
      const element1 = { contentPageId: 'A', path: ['A'] } as ContentPageletTreeElement;
      const element2 = { contentPageId: 'B', path: ['B'] } as ContentPageletTreeElement;

      const empty = ContentPageletTreeHelper.empty();
      const tree1 = ContentPageletTreeHelper.add(empty, element1);
      const tree2 = ContentPageletTreeHelper.add(tree1, element2);

      expect(tree2).toMatchInlineSnapshot(`
        Object {
          "edges": Object {},
          "nodes": Object {
            "A": Object {
              "contentPageId": "A",
              "path": Array [
                "A",
              ],
            },
            "B": Object {
              "contentPageId": "B",
              "path": Array [
                "B",
              ],
            },
          },
        }
      `);
    });

    it('should add a given element to the tree under root using element path', () => {
      const rootElement = { contentPageId: 'A', path: ['A'] } as ContentPageletTreeElement;
      const child = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageletTreeElement;

      const empty = ContentPageletTreeHelper.empty();
      const root = ContentPageletTreeHelper.add(empty, rootElement);

      const tree = ContentPageletTreeHelper.add(root, child);

      expect(tree).toMatchInlineSnapshot(`
        Object {
          "edges": Object {
            "A": Array [
              "A.1",
            ],
          },
          "nodes": Object {
            "A": Object {
              "contentPageId": "A",
              "path": Array [
                "A",
              ],
            },
            "A.1": Object {
              "contentPageId": "A.1",
              "path": Array [
                "A",
                "A.1",
              ],
            },
          },
        }
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
        Object {
          "edges": Object {
            "A": Array [
              "A.1",
              "A.2",
            ],
          },
          "nodes": Object {
            "A": Object {
              "contentPageId": "A",
              "path": Array [
                "A",
              ],
            },
            "A.1": Object {
              "contentPageId": "A.1",
              "path": Array [
                "A",
                "A.1",
              ],
            },
            "A.2": Object {
              "contentPageId": "A.2",
              "path": Array [
                "A",
                "A.2",
              ],
            },
          },
        }
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
        Object {
          "edges": Object {
            "A": Array [
              "A.1",
            ],
            "A.1": Array [
              "A.1.a",
            ],
          },
          "nodes": Object {
            "A": Object {
              "contentPageId": "A",
              "path": Array [
                "A",
              ],
            },
            "A.1": Object {
              "contentPageId": "A.1",
              "path": Array [
                "A",
                "A.1",
              ],
            },
            "A.1.a": Object {
              "contentPageId": "A.1.a",
              "path": Array [
                "A",
                "A.1",
                "A.1.a",
              ],
            },
          },
        }
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
        Object {
          "edges": Object {
            "A": Array [
              "A.1",
              "A.2",
            ],
            "A.1": Array [
              "A.1.a",
              "A.1.b",
            ],
          },
          "nodes": Object {
            "A": Object {
              "contentPageId": "A",
              "path": Array [
                "A",
              ],
            },
            "A.1": Object {
              "contentPageId": "A.1",
              "path": Array [
                "A",
                "A.1",
              ],
            },
            "A.1.a": Object {
              "contentPageId": "A.1.a",
              "path": Array [
                "A",
                "A.1",
                "A.1.a",
              ],
            },
            "A.1.b": Object {
              "contentPageId": "A.1.b",
              "path": Array [
                "A",
                "A.1",
                "A.1.b",
              ],
            },
            "A.2": Object {
              "contentPageId": "A.2",
              "path": Array [
                "A",
                "A.2",
              ],
            },
          },
        }
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
        contentPageId: 'A.B',
        path: ['A.B'],
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
        Object {
          "edges": Object {},
          "nodes": Object {
            "A": Object {
              "contentPageId": "A",
              "path": Array [
                "A",
              ],
            },
            "A.B": Object {
              "contentPageId": "A.B",
              "path": Array [
                "A.B",
              ],
            },
          },
        }
      `);
    });

    it('should return importing tree when merging tree to an empty tree', () => {
      const empty = ContentPageletTreeHelper.empty();
      const result = ContentPageletTreeHelper.merge(empty, treeAAB);

      expect(result).toMatchInlineSnapshot(`
        Object {
          "edges": Object {},
          "nodes": Object {
            "A": Object {
              "contentPageId": "A",
              "path": Array [
                "A",
              ],
            },
            "A.B": Object {
              "contentPageId": "A.B",
              "path": Array [
                "A.B",
              ],
            },
          },
        }
      `);
    });

    it('should combine simple trees in parallel when queried', () => {
      const combined = ContentPageletTreeHelper.merge(treeA, treeB);

      expect(combined).toMatchInlineSnapshot(`
        Object {
          "edges": Object {},
          "nodes": Object {
            "A": Object {
              "contentPageId": "A",
              "path": Array [
                "A",
              ],
            },
            "B": Object {
              "contentPageId": "B",
              "path": Array [
                "B",
              ],
            },
          },
        }
      `);
    });

    it('should behave like a no-op when merging a tree with itself', () => {
      const combined = ContentPageletTreeHelper.merge(treeA, treeA);

      expect(combined).toEqual(treeA);
    });

    it('should combine simple tree as child tree when queried', () => {
      const combined = ContentPageletTreeHelper.merge(treeA, treeAB);

      expect(combined).toMatchInlineSnapshot(`
        Object {
          "edges": Object {},
          "nodes": Object {
            "A": Object {
              "contentPageId": "A",
              "path": Array [
                "A",
              ],
            },
            "A.B": Object {
              "contentPageId": "A.B",
              "path": Array [
                "A.B",
              ],
            },
          },
        }
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
        Object {
          "edges": Object {
            "A": Array [
              "A.1",
              "A.2",
            ],
            "A.1": Array [
              "A.1.a",
              "A.1.b",
            ],
            "B": Array [
              "B.1",
              "B.2",
            ],
            "B.1": Array [
              "B.1.a",
            ],
          },
          "nodes": Object {
            "A": Object {
              "contentPageId": "A",
              "path": Array [
                "A",
              ],
            },
            "A.1": Object {
              "contentPageId": "A.1",
              "path": Array [
                "A",
                "A.1",
              ],
            },
            "A.1.a": Object {
              "contentPageId": "A.1.a",
              "path": Array [
                "A",
                "A.1",
                "A.1.a",
              ],
            },
            "A.1.b": Object {
              "contentPageId": "A.1.b",
              "path": Array [
                "A",
                "A.1",
                "A.1.b",
              ],
            },
            "A.2": Object {
              "contentPageId": "A.2",
              "path": Array [
                "A",
                "A.2",
              ],
            },
            "B": Object {
              "contentPageId": "B",
              "path": Array [
                "B",
              ],
            },
            "B.1": Object {
              "contentPageId": "B.1",
              "path": Array [
                "B",
                "B.1",
              ],
            },
            "B.1.a": Object {
              "contentPageId": "B.1.a",
              "path": Array [
                "B",
                "B.1",
                "B.1.a",
              ],
            },
            "B.2": Object {
              "contentPageId": "B.2",
              "path": Array [
                "B",
                "B.2",
              ],
            },
          },
        }
      `);
    });

    /**

    describe('sorting order', () => {
      const elABRaw = { page: { itemId: 'A' }, path: [{ itemId: 'A' }, { itemId: 'b' }] } as ContentPageletTreeData;
      const elARaw = {
        page: { itemId: 'A' },
        path: [{ itemId: 'A' }],
        elements: [{ path: [{ itemId: 'A' }, { itemId: 'a' }] }, elABRaw, { path: [{ itemId: 'A' }, { itemId: 'c' }] }],
      } as ContentPageletTreeData;

      const elBRaw = { page: { itemId: 'B' }, path: [{ itemId: 'B' }] } as ContentPageletTreeData;

      let tree: ContentPageletTree;
      let contentPageletTreeMapper: ContentPageletTreeMapper;

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [provideMockStore()],
        });
        contentPageletTreeMapper = TestBed.inject(ContentPageletTreeMapper);

        tree = [elARaw, elBRaw].reduce(
          (acc, val) => ContentPageletTreeHelper.merge(acc, contentPageletTreeMapper.fromData(val)),
          ContentPageletTreeHelper.empty()
        );
      });

      it('should be created', () => {
        expect(tree).toMatchInlineSnapshot(`undefined`);
        const elAb = tree.nodes['A.b'];
        expect(elAb.path).toEqual(['A', 'A.b']);
        expect(elAb.name).toBeUndefined();
      });

      describe('with sub element update', () => {
        let elAbUpdateTree: ContentPageletTree;

        beforeEach(() => {
          const elAbUpdateRaw = { ...elABRaw, name: 'update' };
          elAbUpdateTree = contentPageletTreeMapper.fromData(elAbUpdateRaw);
        });

        it('should be created', () => {
          const elAbUpdate = elAbUpdateTree.nodes['A.b'];
          expect(elAbUpdate.name).not.toBeUndefined();
        });

        it('should update element when trees are merged to left', () => {
          const mergeResult = ContentPageletTreeHelper.merge(tree, elAbUpdateTree);
          expect(mergeResult.nodes['A.b'].name).not.toBeUndefined();
        });

        it('should update element when trees are merged to right', () => {
          const mergeResult = ContentPageletTreeHelper.merge(elAbUpdateTree, tree);
          expect(mergeResult.nodes['A.b'].name).not.toBeUndefined();
        });

        it('should not change sorting order when merged to left', () => {
          const mergeResult = ContentPageletTreeHelper.merge(tree, elAbUpdateTree);
          expect(mergeResult.edges.A).toEqual(['A.a', 'A.b', 'A.c']);
        });

        it('should not change sorting order when merged to right', () => {
          const mergeResult = ContentPageletTreeHelper.merge(elAbUpdateTree, tree);
          expect(mergeResult.edges.A).toEqual(['A.a', 'A.b', 'A.c']);
        });
      });

      /* describe('with root element update', () => {
        let elBUpdateTree: ContentPageletTree;

        beforeEach(() => {
          const elBUpdateRaw = { ...elBRaw, name: 'update' };
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
    */
  });
});
