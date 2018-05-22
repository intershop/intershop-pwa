import * as using from 'jasmine-data-provider';
import { categoryTree } from '../../utils/dev/test-data-utils';
import { CategoryData } from './category.interface';
import { CategoryMapper } from './category.mapper';
import { Category } from './category.model';

describe('Category Mapper', () => {
  describe('mapCategoryPath()', () => {
    it('should throw on falsy or empty input', () => {
      expect(() => CategoryMapper.mapCategoryPath(undefined)).toThrowError('input is falsy');
      expect(() => CategoryMapper.mapCategoryPath(null)).toThrow('input is falsy');
      expect(() => CategoryMapper.mapCategoryPath([])).toThrow('input is falsy');
    });

    using(
      [
        { path: [{ id: '1' }], result: ['1'] },
        { path: [{ id: '1' }, { id: '2' }], result: ['1', '1.2'] },
        { path: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }], result: ['1', '1.2', '1.2.3', '1.2.3.4'] },
      ],
      slice => {
        it(`should return ${slice.result} when mapping path from '${JSON.stringify(slice.path)}'`, () => {
          expect(CategoryMapper.mapCategoryPath(slice.path)).toEqual(slice.result);
        });
      }
    );
  });

  describe('categoriesFromCategoryPath()', () => {
    it('should return empty tree on falsy or empty imput', () => {
      expect(CategoryMapper.categoriesFromCategoryPath(undefined)).toEqual(categoryTree());
      expect(CategoryMapper.categoriesFromCategoryPath(null)).toEqual(categoryTree());
      expect(CategoryMapper.categoriesFromCategoryPath([])).toEqual(categoryTree());
    });

    const cat1 = { uniqueId: '1', categoryPath: ['1'], completenessLevel: 0, name: 'n1' } as Category;
    const cat2 = { uniqueId: '1.2', categoryPath: ['1', '1.2'], completenessLevel: 0, name: 'n2' } as Category;
    const cat3 = {
      uniqueId: '1.2.3',
      categoryPath: ['1', '1.2', '1.2.3'],
      completenessLevel: 0,
      name: 'n3',
    } as Category;

    using(
      [
        { path: [{ id: '1', name: 'n1' }], result: categoryTree() },
        { path: [{ id: '1', name: 'n1' }, { id: '2', name: 'n2' }], result: categoryTree([cat1]) },
        {
          path: [{ id: '1', name: 'n1' }, { id: '2', name: 'n2' }, { id: '3', name: 'n3' }, { id: '4', name: 'n4' }],
          result: categoryTree([cat1, cat2, cat3]),
        },
      ],
      slice => {
        it(`should return tree with ${Object.keys(slice.result.nodes)} when mapping path from '${JSON.stringify(
          slice.path
        )}'`, () => {
          expect(CategoryMapper.categoriesFromCategoryPath(slice.path)).toEqual(slice.result);
        });
      }
    );
  });

  describe('computeCompleteness()', () => {
    it('should return -1 for falsy inputs', () => {
      expect(CategoryMapper.computeCompleteness(null)).toEqual(-1);
      expect(CategoryMapper.computeCompleteness(undefined)).toEqual(-1);
      expect(CategoryMapper.computeCompleteness(null)).toEqual(-1);
    });
    it('should return 0 for input from top level call', () => {
      expect(CategoryMapper.computeCompleteness({ uri: 'some' } as CategoryData)).toEqual(0);
    });
    it('should return 1 for input from subcategories from category call', () => {
      expect(CategoryMapper.computeCompleteness({ uri: 'some', images: [{}] } as CategoryData)).toEqual(1);
    });
    it('should return 2 for input from categories call', () => {
      expect(CategoryMapper.computeCompleteness({ images: [{}], categoryPath: [{}, {}] } as CategoryData)).toEqual(2);
    });
    it('should return 2 for input from categories call with root categories', () => {
      expect(CategoryMapper.computeCompleteness({ categoryPath: [{}] } as CategoryData)).toEqual(2);
    });
  });

  describe('fromDataSingle()', () => {
    it('should throw an error when input is falsy', () => {
      expect(() => CategoryMapper.fromDataSingle(undefined)).toThrow();
    });

    it('should return Category when supplied with raw CategoryData', () => {
      const category = CategoryMapper.fromDataSingle({ categoryPath: [{ id: '1' }] } as CategoryData);
      expect(category).toBeTruthy();
    });

    it('should insert uniqueId of raw CategoryData when categoryPath is supplied', () => {
      const category = CategoryMapper.fromDataSingle({ categoryPath: [{ id: '1' }] } as CategoryData);
      expect(category.uniqueId).toEqual('1');
    });

    it('should use categoryPath of raw CategoryData when creating uniqueId and categoryPath', () => {
      const category = CategoryMapper.fromDataSingle({
        categoryPath: [{ id: '1' }, { id: '2' }],
      } as CategoryData);
      expect(category.uniqueId).toEqual('1.2');
      expect(category.categoryPath).toEqual(['1', '1.2']);
    });
  });

  describe('fromData', () => {
    it(`should throw error when input is falsy`, () => {
      expect(() => CategoryMapper.fromData(null)).toThrow();
    });

    it(`should return something truthy when mapping a raw CategoryData`, () => {
      expect(
        CategoryMapper.fromData({
          categoryPath: [{ id: '1' }, { id: '2' }],
        } as CategoryData)
      ).toBeTruthy();
    });

    it(`should return CategoryTree with one root node when raw CategoryData only has one`, () => {
      const tree = CategoryMapper.fromData({
        categoryPath: [{ id: '1' }],
      } as CategoryData);
      expect(tree).toBeTruthy();
      expect(tree.rootIds).toEqual(['1']);
      expect(Object.keys(tree.nodes)).toEqual(['1']);
      const rootNode = tree.nodes['1'];
      expect(rootNode).toBeTruthy();
      expect(rootNode.uniqueId).toEqual('1');
      expect(tree.edges).toEqual({});
    });

    it(`should return CategoryTree with node and computed uniqueid when raw CategoryData was supplied with categoryPath`, () => {
      const tree = CategoryMapper.fromData({
        categoryPath: [{ id: '1' }, { id: '2' }],
      } as CategoryData);
      expect(tree).toBeTruthy();
      expect(tree.rootIds).toEqual(['1']);
      expect(Object.keys(tree.nodes)).toEqual(['1', '1.2']);

      const node = tree.nodes['1.2'];
      expect(node).toBeTruthy();
      expect(node.uniqueId).toEqual('1.2');

      expect(tree.edges).toEqual({ '1': ['1.2'] });
    });

    it(`should handle sub categories on raw CategoryData`, () => {
      const tree = CategoryMapper.fromData({
        categoryPath: [{ id: '1' }],
        subCategories: [{ categoryPath: [{ id: '1' }, { id: '2' }] } as CategoryData],
      } as CategoryData);
      expect(tree).toBeTruthy();

      expect(tree.rootIds).toEqual(['1']);

      expect(Object.keys(tree.nodes)).toEqual(['1', '1.2']);
      expect(tree.nodes['1']).toBeTruthy();
      expect(tree.nodes['1'].uniqueId).toEqual('1');
      expect(tree.nodes['1.2']).toBeTruthy();
      expect(tree.nodes['1.2'].uniqueId).toEqual('1.2');

      expect(Object.keys(tree.nodes)).toEqual(['1', '1.2']);

      expect(tree.edges).toEqual({ '1': ['1.2'] });
    });
  });
});
