import { TestBed } from '@angular/core/testing';
import { instance, mock, when } from 'ts-mockito';

import { SparqueImageMapper } from 'ish-core/models/sparque-image/sparque-image.mapper';

import { SparqueCategoryMapper } from './sparque-category.mapper';

const categoryImageUrl = 'M/image.jpg';

const categoryImage = {
  type: 'Image',
  effectiveUrl: 'https://staticEndpoint/M/image.jpg',
  viewID: 'front',
  typeID: 'M',
  name: 'front M',
  imageActualHeight: 270,
  imageActualWidth: 270,
  primaryImage: true,
};

const sparqueCategories = [
  {
    categoryID: '789',
    categoryName: 'Laser',
    totalCount: 1,
    parentCategoryId: '456',
    attributes: [
      {
        name: 'image',
        value: 'M/789.jpg',
      },
      {
        name: 'online',
        value: '1',
      },
      {
        name: 'root',
        value: '0',
      },
    ],
  },
];

const sparqueCategoriesWithSubCategories = [
  {
    categoryID: '123',
    categoryName: 'Computers',
    totalCount: 10,
    attributes: [
      {
        name: 'image',
        value: 'M/123.jpg',
      },
    ],
    subCategories: [
      {
        categoryID: '456',
        categoryName: 'Printers',
        totalCount: 5,
        attributes: [
          {
            name: 'image',
            value: 'M/456.jpg',
          },
        ],
        subCategories: [
          {
            categoryID: '789',
            categoryName: 'Laser',
            totalCount: 1,
            attributes: [
              {
                name: 'image',
                value: 'M/789.jpg',
              },
            ],
          },
        ],
      },
    ],
  },
];

describe('Sparque Category Mapper', () => {
  let sparqueCategoryMapper: SparqueCategoryMapper;
  const sparqueImageMapper = mock(SparqueImageMapper);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SparqueImageMapper, useFactory: () => instance(sparqueImageMapper) }],
    });
    sparqueCategoryMapper = TestBed.inject(SparqueCategoryMapper);
    when(sparqueImageMapper.fromImageUrl(categoryImageUrl)).thenReturn(categoryImage);
    when(sparqueImageMapper.fromImageUrl(undefined)).thenReturn(undefined);
  });

  describe('fromSuggestionsData', () => {
    it('should create the category tree correctly from suggestions data', () => {
      const result = sparqueCategoryMapper.fromSuggestionsData(sparqueCategories);
      expect(result.categoryIds).toMatchInlineSnapshot(`
        [
          "789",
        ]
      `);
      expect(result.categoryTree).toMatchInlineSnapshot(`
        └─ 789

      `);
    });

    it('should return empty object if categories are empty', () => {
      const result = sparqueCategoryMapper.fromSuggestionsData(undefined);
      expect(result.categoryIds).toMatchInlineSnapshot(`[]`);
      expect(result.categoryTree).toMatchInlineSnapshot(``);
    });
  });

  describe('fromCategoryTreeData', () => {
    it('should create the category tree correctly from root categories without subcategories', () => {
      const result = sparqueCategoryMapper.fromCategoryTreeData(sparqueCategories);
      expect(result).toMatchInlineSnapshot(`
        └─ 789

      `);
    });

    it('should create the category tree correctly with subcategories', () => {
      const result = sparqueCategoryMapper.fromCategoryTreeData(sparqueCategoriesWithSubCategories);
      expect(result).toMatchInlineSnapshot(`
        └─ 123
           └─ 123.456
              └─ 123.456.789

      `);
    });

    it('should return empty tree if categories are empty', () => {
      const result = sparqueCategoryMapper.fromCategoryTreeData(undefined);
      expect(result).toMatchInlineSnapshot(``);
    });
  });
});
