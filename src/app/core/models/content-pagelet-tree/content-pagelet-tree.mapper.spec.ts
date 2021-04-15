import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { pageTree } from 'ish-core/utils/dev/test-data-utils';

import { ContentPageletTreeData, ContentPageletTreeLink } from './content-pagelet-tree.interface';
import { ContentPageletTreeMapper } from './content-pagelet-tree.mapper';
import { ContentPageletTreeElement } from './content-pagelet-tree.model';

describe('Content Pagelet Tree Mapper', () => {
  let contentPageletTreeMapper: ContentPageletTreeMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CoreStoreModule.forTesting(['configuration'])] });
    contentPageletTreeMapper = TestBed.inject(ContentPageletTreeMapper);
  });

  describe('mapContentPageTreeElementPath()', () => {
    it('should throw on falsy or empty input', () => {
      expect(() => contentPageletTreeMapper.mapContentPageTreeElementPath(undefined)).toThrowError('input is falsy');
      expect(() => contentPageletTreeMapper.mapContentPageTreeElementPath(undefined)).toThrow('input is falsy');
      expect(() => contentPageletTreeMapper.mapContentPageTreeElementPath([])).toThrow('input is falsy');
    });

    it.each([
      [['1'], [{ itemId: '1' }] as ContentPageletTreeLink[]],
      [['1', '1.2'], [{ itemId: '1' }, { itemId: '1.2' }] as ContentPageletTreeLink[]],
      [
        ['1', '1.2', '1.2.3', '1.2.3.4'],
        [{ itemId: '1' }, { itemId: '1.2' }, { itemId: '1.2.3' }, { itemId: '1.2.3.4' }] as ContentPageletTreeLink[],
      ],
    ])(`should return %p when mapping path from %j`, (result, path) => {
      expect(contentPageletTreeMapper.mapContentPageTreeElementPath(path)).toEqual(result);
    });
  });

  describe('treeElementsFromTreeElementPath()', () => {
    it('should return empty tree on falsy or empty imput', () => {
      expect(contentPageletTreeMapper.treeElementsFromTreeElementPath(undefined)).toEqual(pageTree());
      expect(contentPageletTreeMapper.treeElementsFromTreeElementPath([])).toEqual(pageTree());
    });

    const el1 = { contentPageId: '1', path: ['1'], name: 'n1' } as ContentPageletTreeElement;
    const el2 = { contentPageId: '2', path: ['1', '2'], name: 'n2' } as ContentPageletTreeElement;
    const el3 = { contentPageId: '3', path: ['1', '2', '3'], name: 'n3' } as ContentPageletTreeElement;
    const el4 = { contentPageId: '4', path: ['1', '2', '3', '4'], name: 'n4' } as ContentPageletTreeElement;

    it('should return tree when mapping path with one element', () => {
      expect(
        contentPageletTreeMapper.treeElementsFromTreeElementPath([
          { itemId: '1', title: 'n1' },
        ] as ContentPageletTreeLink[])
      ).toEqual(pageTree([el1]));
    });

    it('should return both elements when mapping path with two elements', () => {
      expect(
        contentPageletTreeMapper.treeElementsFromTreeElementPath([
          { itemId: '1', title: 'n1' },
          { itemId: '2', title: 'n2' },
        ] as ContentPageletTreeLink[])
      ).toEqual(pageTree([el1, el2]));
    });

    it('should return the all elements when mapping path with four elements', () => {
      expect(
        contentPageletTreeMapper.treeElementsFromTreeElementPath([
          { itemId: '1', title: 'n1' },
          { itemId: '2', title: 'n2' },
          { itemId: '3', title: 'n3' },
          { itemId: '4', title: 'n4' },
        ] as ContentPageletTreeLink[])
      ).toEqual(pageTree([el1, el2, el3, el4]));
    });
  });

  describe('fromDataSingle', () => {
    it('should throw an error when input is falsy', () => {
      expect(() => contentPageletTreeMapper.fromDataSingle(undefined)).toThrow();
    });

    it('should return Category when supplied with raw CategoryData', () => {
      const element = contentPageletTreeMapper.fromDataSingle({
        page: { itemId: '1' },
        path: [{ itemId: '1' }],
      } as ContentPageletTreeData);
      expect(element).toBeTruthy();
    });

    it('should insert uniqueId of raw CategoryData when categoryPath is supplied', () => {
      const element = contentPageletTreeMapper.fromDataSingle({
        page: { itemId: '1' },
        path: [{ itemId: '1' }],
      } as ContentPageletTreeData);
      expect(element).toHaveProperty('contentPageId', '1');
    });

    it('should use categoryPath of raw CategoryData when creating uniqueId and categoryPath', () => {
      const element = contentPageletTreeMapper.fromDataSingle({
        page: { itemId: '2' },
        path: [{ itemId: '1' }, { itemId: '2' }],
      } as ContentPageletTreeData);
      expect(element).toHaveProperty('contentPageId', '2');
      expect(element.path).toEqual(['1', '2']);
    });
  });

  describe('fromData', () => {
    it(`should throw error when input is falsy`, () => {
      expect(() => contentPageletTreeMapper.fromData(undefined)).toThrow();
    });

    it(`should return something truthy when mapping a raw CategoryData`, () => {
      expect(
        contentPageletTreeMapper.fromData({
          page: { itemId: '2' },
          path: [{ itemId: '1' }],
          parent: { itemId: '1' },
        } as ContentPageletTreeData)
      ).toBeTruthy();
    });

    it(`should return CategoryTree with one root node when raw CategoryData only has one`, () => {
      const tree = contentPageletTreeMapper.fromData({
        page: { itemId: '1' },
      } as ContentPageletTreeData);

      expect(tree).toMatchInlineSnapshot(`
        Object {
          "edges": Object {},
          "nodes": Object {
            "1": Object {
              "contentPageId": "1",
              "name": undefined,
              "path": Array [
                "1",
              ],
            },
          },
        }
      `);

      expect(tree.nodes['1']).toHaveProperty('contentPageId', '1');
    });

    it(`should return CategoryTree with node and computed uniqueid when raw CategoryData was supplied with categoryPath`, () => {
      const tree = contentPageletTreeMapper.fromData({
        page: { itemId: '2' },
        path: [{ itemId: '1' }],
        parent: { itemId: '1' },
      } as ContentPageletTreeData);

      expect(tree).toMatchInlineSnapshot(`
        Object {
          "edges": Object {
            "1": Array [
              "2",
            ],
          },
          "nodes": Object {
            "1": Object {
              "contentPageId": "1",
              "name": undefined,
              "path": Array [
                "1",
              ],
            },
            "2": Object {
              "contentPageId": "2",
              "name": undefined,
              "path": Array [
                "1",
                "2",
              ],
            },
          },
        }
      `);

      expect(tree.nodes['2']).toHaveProperty('contentPageId', '2');
    });

    it(`should handle sub element on raw CategoryData`, () => {
      const tree = contentPageletTreeMapper.fromData({
        page: { itemId: '1' },
        elements: [
          {
            page: { itemId: '2' },
            path: [{ itemId: '1' }],
            parent: { itemId: '1' },
            type: 'PageTreeRO',
          },
        ] as ContentPageletTreeData[],
      } as ContentPageletTreeData);

      expect(tree).toMatchInlineSnapshot(`
        Object {
          "edges": Object {
            "1": Array [
              "2",
            ],
          },
          "nodes": Object {
            "1": Object {
              "contentPageId": "1",
              "name": undefined,
              "path": Array [
                "1",
              ],
            },
            "2": Object {
              "contentPageId": "2",
              "name": undefined,
              "path": Array [
                "1",
                "2",
              ],
            },
          },
        }
      `);
      expect(tree.nodes['1']).toHaveProperty('contentPageId', '1');
      expect(tree.nodes['2']).toHaveProperty('contentPageId', '2');
    });

    it(`should handle sub element page tree links on raw CategoryData`, () => {
      const tree = contentPageletTreeMapper.fromData({
        page: { itemId: '1' },
        elements: [
          {
            itemId: '2',
            type: 'PageTreeLink',
          },
          {
            itemId: '3',
            type: 'PageTreeLink',
          },
        ] as ContentPageletTreeLink[],
      } as ContentPageletTreeData);

      expect(tree).toMatchInlineSnapshot(`
        Object {
          "edges": Object {
            "1": Array [
              "2",
              "3",
            ],
          },
          "nodes": Object {
            "1": Object {
              "contentPageId": "1",
              "name": undefined,
              "path": Array [
                "1",
              ],
            },
            "2": Object {
              "contentPageId": "2",
              "name": undefined,
              "path": Array [
                "1",
                "2",
              ],
            },
            "3": Object {
              "contentPageId": "3",
              "name": undefined,
              "path": Array [
                "1",
                "3",
              ],
            },
          },
        }
      `);
      expect(tree.nodes['1']).toHaveProperty('contentPageId', '1');
      expect(tree.nodes['2']).toHaveProperty('contentPageId', '2');
      expect(tree.nodes['3']).toHaveProperty('contentPageId', '3');
    });
  });

  describe('convertLinkToTreeData', () => {
    it('should convert given page tree link to page tree', () => {
      const parent = { page: { itemId: '1' } } as ContentPageletTreeData;
      const link = { itemId: '2' } as ContentPageletTreeLink;

      const convertedTree = contentPageletTreeMapper.convertLinkToTreeData(parent, link);
      expect(convertedTree.page).toEqual(link);
      expect(convertedTree.path).toEqual([parent.page, link]);
      expect(convertedTree.type).toEqual('PageTreeRO');
    });

    it('should convert given page tree link to page tree with existing parent path', () => {
      const parent = { path: [{ itemId: '1' }, { itemId: '2' }] } as ContentPageletTreeData;
      const link = { itemId: '3' } as ContentPageletTreeLink;

      const convertedTree = contentPageletTreeMapper.convertLinkToTreeData(parent, link);
      expect(convertedTree.page).toEqual(link);
      expect(convertedTree.path).toEqual([...parent.path, link]);
      expect(convertedTree.type).toEqual('PageTreeRO');
    });
  });
});
