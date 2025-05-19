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
      {
        name: 'hasParent',
        value: [
          {
            identifier: '456',
            image: 'M/456.jpg',
            name: {
              'de-DE': 'Drucker',
              'en-US': 'Printers',
              'fr-FR': 'Imprimantes',
            },
            online: 1,
            root: 0,
            hasParent: [
              {
                identifier: '123',
                name: {
                  'de-DE': 'Computer',
                  'en-US': 'Computers',
                  'fr-FR': 'Ordinateurs',
                },
                online: 1,
                root: 1,
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

  describe('fromData', () => {
    it('should create the category tree correctly', () => {
      const result = sparqueCategoryMapper.fromSuggestionsData(sparqueCategories);
      expect(result.categoryIds).toMatchInlineSnapshot(`
        [
          "123.456.789",
        ]
      `);
      expect(result.categoryTree).toMatchInlineSnapshot(`
        └─ 123
           └─ 123.456
              └─ 123.456.789

      `);
    });

    it('should return empty object if categories are empty', () => {
      const result = sparqueCategoryMapper.fromSuggestionsData(undefined);
      expect(result.categoryIds).toMatchInlineSnapshot(`[]`);
      expect(result.categoryTree).toMatchInlineSnapshot(``);
    });
  });
});
