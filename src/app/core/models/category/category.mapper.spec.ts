import { TestBed, async } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';
import { anything, spy, verify } from 'ts-mockito';

import { ImageMapper } from 'ish-core/models/image/image.mapper';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { CategoryData } from './category.interface';
import { CategoryMapper } from './category.mapper';
import { Category } from './category.model';

describe('Category Mapper', () => {
  let categoryMapper: CategoryMapper;
  let imageMapper: ImageMapper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ imports: [ngrxTesting({ reducers: { configuration: configurationReducer } })] });
    categoryMapper = TestBed.get(CategoryMapper);
    imageMapper = spy(TestBed.get(ImageMapper));
  }));

  describe('mapCategoryPath()', () => {
    it('should throw on falsy or empty input', () => {
      expect(() => categoryMapper.mapCategoryPath(undefined)).toThrowError('input is falsy');
      expect(() => categoryMapper.mapCategoryPath(undefined)).toThrow('input is falsy');
      expect(() => categoryMapper.mapCategoryPath([])).toThrow('input is falsy');
    });

    using(
      [
        { path: [{ id: '1' }], result: ['1'] },
        { path: [{ id: '1' }, { id: '2' }], result: ['1', '1.2'] },
        { path: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }], result: ['1', '1.2', '1.2.3', '1.2.3.4'] },
      ],
      slice => {
        it(`should return ${slice.result} when mapping path from '${JSON.stringify(slice.path)}'`, () => {
          expect(categoryMapper.mapCategoryPath(slice.path)).toEqual(slice.result);
        });
      }
    );
  });

  describe('categoriesFromCategoryPath()', () => {
    it('should return empty tree on falsy or empty imput', () => {
      expect(categoryMapper.categoriesFromCategoryPath(undefined)).toEqual(categoryTree());
      expect(categoryMapper.categoriesFromCategoryPath([])).toEqual(categoryTree());
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
          expect(categoryMapper.categoriesFromCategoryPath(slice.path)).toEqual(slice.result);
        });
      }
    );
  });

  describe('computeCompleteness()', () => {
    it('should return -1 for falsy inputs', () => {
      expect(categoryMapper.computeCompleteness(undefined)).toEqual(-1);
    });
    it('should return 0 for input from top level call', () => {
      expect(categoryMapper.computeCompleteness({ uri: 'some' } as CategoryData)).toEqual(0);
    });
    it('should return 1 for input from subcategories from category call', () => {
      expect(categoryMapper.computeCompleteness({ uri: 'some', images: [{}] } as CategoryData)).toEqual(1);
    });
    it('should return 2 for input from categories call', () => {
      expect(categoryMapper.computeCompleteness({ images: [{}], categoryPath: [{}, {}] } as CategoryData)).toEqual(2);
    });
    it('should return 3 for input from categories call with root categories', () => {
      expect(categoryMapper.computeCompleteness({ categoryPath: [{}], attributes: [] } as CategoryData)).toEqual(3);
    });
  });

  describe('fromDataSingle()', () => {
    it('should throw an error when input is falsy', () => {
      expect(() => categoryMapper.fromDataSingle(undefined)).toThrow();
    });

    it('should return Category when supplied with raw CategoryData', () => {
      const category = categoryMapper.fromDataSingle({ categoryPath: [{ id: '1' }] } as CategoryData);
      expect(category).toBeTruthy();
      verify(imageMapper.fromImages(anything())).once();
    });

    it('should insert uniqueId of raw CategoryData when categoryPath is supplied', () => {
      const category = categoryMapper.fromDataSingle({ categoryPath: [{ id: '1' }] } as CategoryData);
      expect(category).toHaveProperty('uniqueId', '1');
      verify(imageMapper.fromImages(anything())).once();
    });

    it('should use categoryPath of raw CategoryData when creating uniqueId and categoryPath', () => {
      const category = categoryMapper.fromDataSingle({
        categoryPath: [{ id: '1' }, { id: '2' }],
      } as CategoryData);
      expect(category).toHaveProperty('uniqueId', '1.2');
      expect(category.categoryPath).toEqual(['1', '1.2']);
      verify(imageMapper.fromImages(anything())).once();
    });
  });

  describe('fromData', () => {
    it(`should throw error when input is falsy`, () => {
      expect(() => categoryMapper.fromData(undefined)).toThrow();
    });

    it(`should return something truthy when mapping a raw CategoryData`, () => {
      expect(
        categoryMapper.fromData({
          categoryPath: [{ id: '1' }, { id: '2' }],
        } as CategoryData)
      ).toBeTruthy();
    });

    it(`should return CategoryTree with one root node when raw CategoryData only has one`, () => {
      const tree = categoryMapper.fromData({
        categoryPath: [{ id: '1' }],
      } as CategoryData);

      expect(tree).toMatchInlineSnapshot(`
        └─ 1

      `);

      expect(tree.nodes['1']).toHaveProperty('uniqueId', '1');

      verify(imageMapper.fromImages(anything())).once();
    });

    it(`should return CategoryTree with node and computed uniqueid when raw CategoryData was supplied with categoryPath`, () => {
      const tree = categoryMapper.fromData({
        categoryPath: [{ id: '1' }, { id: '2' }],
      } as CategoryData);

      expect(tree).toMatchInlineSnapshot(`
        └─ 1
           └─ 1.2

      `);

      expect(tree.nodes['1.2']).toHaveProperty('uniqueId', '1.2');
    });

    it(`should handle sub categories on raw CategoryData`, () => {
      const tree = categoryMapper.fromData({
        categoryPath: [{ id: '1' }],
        subCategories: [{ categoryPath: [{ id: '1' }, { id: '2' }] } as CategoryData],
      } as CategoryData);

      expect(tree).toMatchInlineSnapshot(`
        └─ 1
           └─ 1.2

      `);
      expect(tree.nodes['1']).toHaveProperty('uniqueId', '1');
      expect(tree.nodes['1.2']).toHaveProperty('uniqueId', '1.2');
    });
  });
});
