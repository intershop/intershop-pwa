import { TestBed } from '@angular/core/testing';

import { Link } from 'ish-core/models/link/link.model';
import { pageTree } from 'ish-core/utils/dev/test-data-utils';

import { ContentPageTreeData } from './content-page-tree.interface';
import { ContentPageTreeMapper } from './content-page-tree.mapper';
import { ContentPageTreeElement } from './content-page-tree.model';

describe('Content Page Tree Mapper', () => {
  let contentPageTreeMapper: ContentPageTreeMapper;

  beforeEach(() => {
    contentPageTreeMapper = TestBed.inject(ContentPageTreeMapper);
  });

  describe('mapContentPageTreeElementPath()', () => {
    it('should throw on falsy or empty input', () => {
      expect(() => contentPageTreeMapper.mapContentPageTreeElementPath(undefined)).toThrowError('input is falsy');
      expect(() => contentPageTreeMapper.mapContentPageTreeElementPath(undefined)).toThrow('input is falsy');
      expect(() => contentPageTreeMapper.mapContentPageTreeElementPath([])).toThrow('input is falsy');
    });

    it.each([
      [['1'], [{ itemId: '1' }] as Link[]],
      [['1', '1.2'], [{ itemId: '1' }, { itemId: '1.2' }] as Link[]],
      [
        ['1', '1.2', '1.2.3', '1.2.3.4'],
        [{ itemId: '1' }, { itemId: '1.2' }, { itemId: '1.2.3' }, { itemId: '1.2.3.4' }] as Link[],
      ],
    ])(`should return %p when mapping path from %j`, (result, path) => {
      expect(contentPageTreeMapper.mapContentPageTreeElementPath(path)).toEqual(result);
    });
  });

  describe('treeElementsFromTreeElementPath()', () => {
    it('should return empty tree on falsy or empty input', () => {
      expect(contentPageTreeMapper.treeElementsFromTreeElementPath(undefined)).toEqual(pageTree());
      expect(contentPageTreeMapper.treeElementsFromTreeElementPath([])).toEqual(pageTree());
    });

    const el1 = { contentPageId: '1', path: ['1'], name: 'n1' } as ContentPageTreeElement;
    const el2 = { contentPageId: '2', path: ['1', '2'], name: 'n2' } as ContentPageTreeElement;
    const el3 = { contentPageId: '3', path: ['1', '2', '3'], name: 'n3' } as ContentPageTreeElement;
    const el4 = { contentPageId: '4', path: ['1', '2', '3', '4'], name: 'n4' } as ContentPageTreeElement;

    it('should return tree when mapping path with one element', () => {
      expect(contentPageTreeMapper.treeElementsFromTreeElementPath([{ itemId: '1', title: 'n1' }] as Link[])).toEqual(
        pageTree([el1])
      );
    });

    it('should return both elements when mapping path with two elements', () => {
      expect(
        contentPageTreeMapper.treeElementsFromTreeElementPath([
          { itemId: '1', title: 'n1' },
          { itemId: '2', title: 'n2' },
        ] as Link[])
      ).toEqual(pageTree([el1, el2]));
    });

    it('should return all elements when mapping path with four elements', () => {
      expect(
        contentPageTreeMapper.treeElementsFromTreeElementPath([
          { itemId: '1', title: 'n1' },
          { itemId: '2', title: 'n2' },
          { itemId: '3', title: 'n3' },
          { itemId: '4', title: 'n4' },
        ] as Link[])
      ).toEqual(pageTree([el1, el2, el3, el4]));
    });
  });

  describe('fromDataSingle', () => {
    it('should throw an error when input is falsy', () => {
      expect(() => contentPageTreeMapper.fromDataSingle(undefined)).toThrow();
    });

    it('should return ContentPageTreeElement when supplied with raw ContentPageTreeData', () => {
      const element = contentPageTreeMapper.fromDataSingle({
        page: { itemId: '1' },
        path: [{ itemId: '1' }],
      } as ContentPageTreeData);
      expect(element).toBeTruthy();
    });

    it('should insert contentPageId of raw ContentPageTreeData', () => {
      const element = contentPageTreeMapper.fromDataSingle({
        page: { itemId: '1' },
        path: [{ itemId: '1' }],
      } as ContentPageTreeData);
      expect(element).toHaveProperty('contentPageId', '1');
    });

    it('should use path of raw ContentPageTreeData when creating contentPageId and path', () => {
      const element = contentPageTreeMapper.fromDataSingle({
        page: { itemId: '2' },
        path: [{ itemId: '1' }, { itemId: '2' }],
      } as ContentPageTreeData);
      expect(element).toHaveProperty('contentPageId', '2');
      expect(element.path).toEqual(['1', '2']);
    });
  });

  describe('fromData', () => {
    it(`should throw error when input is falsy`, () => {
      expect(() => contentPageTreeMapper.fromData(undefined)).toThrow();
    });

    it(`should return something truthy when mapping a raw ContentPageTreeData`, () => {
      expect(
        contentPageTreeMapper.fromData({
          page: { itemId: '2' },
          path: [{ itemId: '1' }],
          parent: { itemId: '1' },
        } as ContentPageTreeData)
      ).toBeTruthy();
    });

    it(`should return ContentPageTree with one root node when raw ContentPageTreeData only has one`, () => {
      const tree = contentPageTreeMapper.fromData({
        page: { itemId: '1' },
      } as ContentPageTreeData);

      expect(tree).toMatchInlineSnapshot(`
        └─ 1

      `);

      expect(tree.nodes['1']).toHaveProperty('contentPageId', '1');
    });

    it(`should return ContentPageTree with node when raw ContentPageTreeData was supplied with path`, () => {
      const tree = contentPageTreeMapper.fromData({
        page: { itemId: '2' },
        path: [{ itemId: '1' }],
        parent: { itemId: '1' },
      } as ContentPageTreeData);

      expect(tree).toMatchInlineSnapshot(`
        └─ 1
           └─ 2

      `);

      expect(tree.nodes['2']).toHaveProperty('contentPageId', '2');
    });

    it(`should handle sub element on raw ContentPageTreeData`, () => {
      const tree = contentPageTreeMapper.fromData({
        page: { itemId: '1' },
        elements: [
          {
            page: { itemId: '2' },
            path: [{ itemId: '1' }],
            parent: { itemId: '1' },
            type: 'PageTreeRO',
          },
        ] as ContentPageTreeData[],
      } as ContentPageTreeData);

      expect(tree).toMatchInlineSnapshot(`
        └─ 1
           └─ 2

      `);
      expect(tree.nodes['1']).toHaveProperty('contentPageId', '1');
      expect(tree.nodes['2']).toHaveProperty('contentPageId', '2');
    });

    it(`should handle sub element page tree links on raw ContentPageTreeData`, () => {
      const tree = contentPageTreeMapper.fromData({
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
        ] as Link[],
      } as ContentPageTreeData);

      expect(tree).toMatchInlineSnapshot(`
        └─ 1
           ├─ 2
           └─ 3

      `);
      expect(tree.nodes['1']).toHaveProperty('contentPageId', '1');
      expect(tree.nodes['2']).toHaveProperty('contentPageId', '2');
      expect(tree.nodes['3']).toHaveProperty('contentPageId', '3');
    });
  });

  describe('convertLinkToTreeData', () => {
    it('should convert given page tree link to page tree', () => {
      const parent = { page: { itemId: '1' } } as ContentPageTreeData;
      const link = { itemId: '2' } as Link;

      const convertedTree = contentPageTreeMapper.convertLinkToTreeData(parent, link);
      expect(convertedTree.page).toEqual(link);
      expect(convertedTree.path).toEqual([parent.page, link]);
      expect(convertedTree.type).toEqual('PageTreeRO');
    });

    it('should convert given page tree link to page tree with existing parent path', () => {
      const parent = { path: [{ itemId: '1' }, { itemId: '2' }] } as ContentPageTreeData;
      const link = { itemId: '3' } as Link;

      const convertedTree = contentPageTreeMapper.convertLinkToTreeData(parent, link);
      expect(convertedTree.page).toEqual(link);
      expect(convertedTree.path).toEqual([...parent.path, link]);
      expect(convertedTree.type).toEqual('PageTreeRO');
    });
  });
});
