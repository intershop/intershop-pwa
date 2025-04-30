import { TestBed } from '@angular/core/testing';
import { instance, mock, when } from 'ts-mockito';

import { SparqueImageMapper } from 'ish-core/models/sparque-image/sparque-image.mapper';

import { SparqueCategory } from './sparque-category.interface';
import { SparqueCategoryMapper } from './sparque-category.mapper';

const attributes = [
  [
    { name: 'description', value: 'cat1 description' },
    { name: 'online', value: '1' },
    { name: 'image', value: 'cat1.url/image.jpg' },
  ],
  [
    { name: 'description', value: 'subCat1 description' },
    { name: 'online', value: '1' },
  ],
  [{ name: 'description', value: 'cat2 description' }],
];

const sparqueCategories = [
  {
    categoryID: 'cat1',
    categoryName: 'category1',
    categoryURL: 'http://category.url',
    totalCount: 10,
    attributes: attributes[0],
    subCategories: [
      {
        categoryID: 'subCat1',
        categoryName: 'sub category2',
        parentCategoryId: 'cat1',
        categoryURL: 'http://subcategory2.url',
        totalCount: 5,
        attributes: attributes[1],
      },
    ],
  },
  {
    categoryID: 'cat2',
    categoryName: 'category2',
    categoryURL: 'http://category2.url',
    totalCount: 102,
    attributes: attributes[2],
    subCategories: [] as SparqueCategory[],
  },
];

const images = [
  {
    type: 'Image',
    effectiveUrl: 'cat1.url/image.jpg',
    viewID: 'front',
    typeID: 'S',
    name: 'front S',
    imageActualHeight: 110,
    imageActualWidth: 110,
    primaryImage: true,
  },
  {
    type: 'Image',
    effectiveUrl: 'not_available/image.jpg',
    viewID: 'front',
    typeID: 'S',
    name: 'front S',
    imageActualHeight: 110,
    imageActualWidth: 110,
    primaryImage: true,
  },
];

const sparqueCategoryTree = {
  categories: sparqueCategories,
};

const categories = [
  {
    uniqueId: sparqueCategories[0].categoryID,
    categoryRef: sparqueCategories[0].categoryID,
    categoryPath: [sparqueCategories[0].categoryID],
    name: sparqueCategories[0].categoryName,
    hasOnlineProducts: true,
    description: sparqueCategories[0].attributes.find(attr => attr.name === 'description').value,
    images: [images[0]],
    attributes: sparqueCategories[0].attributes,
    completenessLevel: 4,
    productCount: sparqueCategories[0].totalCount,
  },
  {
    uniqueId: 'cat1.subCat1',
    categoryRef: 'subCat1',
    categoryPath: ['cat1', 'subCat1'],
    name: 'sub category2',
    hasOnlineProducts: true,
    description: 'subCat1 description',
    completenessLevel: 3,
    productCount: 5,
    images: [images[1]],
    attributes: sparqueCategories[0].subCategories[0].attributes,
  },
  {
    uniqueId: sparqueCategories[1].categoryID,
    categoryRef: sparqueCategories[1].categoryID,
    categoryPath: [sparqueCategories[1].categoryID],
    name: sparqueCategories[1].categoryName,
    hasOnlineProducts: false,
    description: sparqueCategories[1].attributes.find(attr => attr.name === 'description').value,
    completenessLevel: 3,
    productCount: sparqueCategories[1].totalCount,
    attributes: sparqueCategories[1].attributes,
    images: [images[1]],
  },
];

const categoryTree = {
  nodes: {
    [categories[0].uniqueId]: categories[0],
    [categories[1].uniqueId]: categories[1],
    [categories[2].uniqueId]: categories[2],
  },
  rootIds: [sparqueCategories[0].categoryID, sparqueCategories[1].categoryID],
  edges: { [categories[0].uniqueId]: [categories[1].uniqueId] },
  categoryRefs: {
    [sparqueCategories[0].categoryID]: categories[0].categoryRef,
    [sparqueCategories[0].subCategories[0].categoryID]: categories[1].uniqueId,
    [sparqueCategories[1].categoryID]: categories[2].categoryRef,
  },
};

describe('Sparque Category Mapper', () => {
  let sparqueCategoryMapper: SparqueCategoryMapper;
  let sparqueImageMapper: SparqueImageMapper;

  beforeEach(() => {
    sparqueImageMapper = mock(SparqueImageMapper);
    when(sparqueImageMapper.mapCategoryImage(attributes[0])).thenReturn([images[0]]);
    when(sparqueImageMapper.mapCategoryImage(attributes[1])).thenReturn([images[1]]);
    when(sparqueImageMapper.mapCategoryImage(attributes[2])).thenReturn([images[1]]);

    TestBed.configureTestingModule({
      providers: [{ provide: SparqueImageMapper, useFactory: () => instance(sparqueImageMapper) }],
    });
    sparqueCategoryMapper = TestBed.inject(SparqueCategoryMapper);
  });

  describe('fromData', () => {
    it('should create the category tree correctly', () => {
      const result = sparqueCategoryMapper.fromData(sparqueCategoryTree);
      expect(result.nodes).toContainAllKeys([categories[0].uniqueId, categories[1].uniqueId, categories[2].uniqueId]);
      expect(result.nodes).toEqual(categoryTree.nodes);
      expect(result.edges).toEqual(categoryTree.edges);
      expect(result.rootIds).toEqual(categoryTree.rootIds);
      expect(result.categoryRefs).toEqual(categoryTree.categoryRefs);
    });

    it('should return empty object if categories are empty', () => {
      const result = sparqueCategoryMapper.fromData(undefined);
      expect(result.nodes).toBeEmpty();
      expect(result.edges).toBeEmpty();
      expect(result.rootIds).toBeEmpty();
      expect(result.categoryRefs).toBeEmpty();
    });
  });
});
