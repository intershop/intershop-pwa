import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { getStaticEndpoint } from 'ish-core/store/core/configuration';

import { SparqueSuggestions } from './sparque-suggestion.interface';
import { SparqueSuggestionMapper } from './sparque-suggestion.mapper';

describe('Sparque Suggestion Mapper', () => {
  let sparqueSuggestionMapper: SparqueSuggestionMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        provideMockStore({
          selectors: [{ selector: getStaticEndpoint, value: 'https://static.url' }],
        }),
        SparqueSuggestionMapper,
      ],
    });

    sparqueSuggestionMapper = TestBed.inject(SparqueSuggestionMapper);
  });

  describe('fromData', () => {
    it('should map products correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [
          {
            name: 'Product 1',
            shortDescription: 'Short description',
            longDescription: 'Long description',
            manufacturer: 'Manufacturer',
            images: [{ id: '1', url: 'http://image.url', isPrimaryImage: true }],
            attributes: [{ name: 'Color', value: 'Red' }],
            sku: 'SKU1',
            defaultcategoryId: 'cat1',
          },
        ],
        categories: [],
        brands: [],
        keywordSuggestions: [],
        contentSuggestions: [],
      };

      const result: Suggestion = sparqueSuggestionMapper.fromData(sparqueSuggestions);

      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe('Product 1');
      expect(result.products[0].shortDescription).toBe('Short description');
      expect(result.products[0].longDescription).toBe('Long description');
      expect(result.products[0].manufacturer).toBe('Manufacturer');
      expect(result.products[0].images).toHaveLength(1);
      expect(result.products[0].images[0].effectiveUrl).toBe('http://image.url');
      expect(result.products[0].attributes).toHaveLength(1);
      expect(result.products[0].attributes[0].name).toBe('Color');
      expect(result.products[0].attributes[0].value).toBe('Red');
      expect(result.products[0].sku).toBe('SKU1');
      expect(result.products[0].defaultCategoryId).toBe('cat1');
    });

    it('should map categories correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [],
        categories: [
          {
            categoryName: 'Category 1',
            categoryID: 'cat1',
            categoryURL: 'http://category.url',
            parentCategoryId: 'parentCat',
            totalCount: 10,
            attributes: [{ name: 'Type', value: 'Electronics' }],
          },
        ],
        brands: [],
        keywordSuggestions: [],
        contentSuggestions: [],
      };

      const result: Suggestion = sparqueSuggestionMapper.fromData(sparqueSuggestions);

      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].name).toBe('Category 1');
      expect(result.categories[0].uniqueId).toBe('cat1');
      expect(result.categories[0].categoryRef).toBe('http://category.url');
      expect(result.categories[0].categoryPath).toEqual(['parentCat', 'cat1']);
      expect(result.categories[0].hasOnlineProducts).toBeTrue();
      expect(result.categories[0].attributes).toHaveLength(1);
      expect(result.categories[0].attributes[0].name).toBe('Type');
      expect(result.categories[0].attributes[0].value).toBe('Electronics');
    });

    it('should map brands correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [],
        categories: [],
        brands: [
          {
            brandName: 'Brand 1',
            imageUrl: 'http://brand.image.url',
            totalCount: 5,
          },
        ],
        keywordSuggestions: [],
        contentSuggestions: [],
      };

      const result: Suggestion = sparqueSuggestionMapper.fromData(sparqueSuggestions);

      expect(result.brands).toHaveLength(1);
      expect(result.brands[0].name).toBe('Brand 1');
      expect(result.brands[0].imageUrl).toBe('http://brand.image.url');
      expect(result.brands[0].productCount).toBe(5);
    });

    it('should map keyword suggestions correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [],
        categories: [],
        brands: [],
        keywordSuggestions: [{ keyword: 'keyword1' }, { keyword: 'keyword2' }],
        contentSuggestions: [],
      };

      const result: Suggestion = sparqueSuggestionMapper.fromData(sparqueSuggestions);

      expect(result.keywordSuggestions).toHaveLength(2);
      expect(result.keywordSuggestions).toContain('keyword1');
      expect(result.keywordSuggestions).toContain('keyword2');
    });

    it('should map content suggestions correctly', () => {
      const date = new Date('2023-10-01');
      const sparqueSuggestions: SparqueSuggestions = {
        products: [],
        categories: [],
        brands: [],
        keywordSuggestions: [],
        contentSuggestions: [
          {
            newsType: 'News',
            paragraph: 'Paragraph',
            slug: 'slug',
            summary: 'Summary',
            title: 'Title',
            type: 'Type',
            articleDate: date,
          },
        ],
      };

      const result: Suggestion = sparqueSuggestionMapper.fromData(sparqueSuggestions);

      expect(result.contentSuggestions).toHaveLength(1);
      expect(result.contentSuggestions[0].newsType).toBe('News');
      expect(result.contentSuggestions[0].paragraph).toBe('Paragraph');
      expect(result.contentSuggestions[0].slug).toBe('slug');
      expect(result.contentSuggestions[0].summary).toBe('Summary');
      expect(result.contentSuggestions[0].title).toBe('Title');
      expect(result.contentSuggestions[0].type).toBe('Type');
      expect(result.contentSuggestions[0].articleDate).toBe(date);
    });

    it('should return undefined for undefined input', () => {
      const result: Suggestion = sparqueSuggestionMapper.fromData(undefined);
      expect(result).toBeUndefined();
    });
  });
});
