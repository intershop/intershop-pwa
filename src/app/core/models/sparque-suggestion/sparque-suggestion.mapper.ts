import { Injectable } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Category } from 'ish-core/models/category/category.model';
import { SparqueCategory } from 'ish-core/models/sparque-category/sparque-category.interface';
import { SparqueImageMapper } from 'ish-core/models/sparque-image/sparque-image.mapper';
import { SparqueOfferMapper } from 'ish-core/models/sparque-offer/sparque-offer.mapper';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';

import { SparqueKeywordSuggestions, SparqueSuggestions } from './sparque-suggestion.interface';

@Injectable({ providedIn: 'root' })
export class SparqueSuggestionMapper {
  constructor(
    private sparqueProductMapper: SparqueProductMapper,
    private sparqueImageMapper: SparqueImageMapper,
    private sparqueOfferMapper: SparqueOfferMapper
  ) {}

  fromData(suggestion: SparqueSuggestions): Suggestion {
    return {
      products: suggestion?.products ? this.sparqueProductMapper.mapProducts(suggestion.products) : [],
      categories: suggestion?.categories ? this.mapCategories(suggestion.categories) : [],
      brands: suggestion?.brands ? suggestion.brands : [],
      keywordSuggestions: suggestion?.keywordSuggestions ? this.mapKeywords(suggestion.keywordSuggestions) : [],
      contentSuggestions: suggestion?.contentSuggestions ? suggestion.contentSuggestions : [],
      prices: suggestion?.products ? this.sparqueOfferMapper.mapOffers(suggestion.products) : [],
    };
  }

  private mapCategories(categories: SparqueCategory[]): Category[] {
    return categories
      ? categories.map(category => ({
          name: category.categoryName ? category.categoryName : undefined,
          uniqueId: category.parentCategoryId
            ? category.parentCategoryId.concat('.').concat(category.categoryID)
            : category.categoryID,
          categoryRef: category.categoryURL ? category.categoryURL : undefined,
          categoryPath: category.parentCategoryId
            ? [category.parentCategoryId, category.categoryID ? category.categoryID : undefined]
            : category.categoryID
            ? [category.categoryID]
            : [],
          hasOnlineProducts: category.totalCount && category.totalCount > 0,
          description: AttributeHelper.getAttributeValueByAttributeName(category.attributes, 'description'),
          images: this.sparqueImageMapper.mapCategoryImage(category.attributes),
          attributes: category.attributes,
          completenessLevel: 0,
          productCount: category.totalCount ? category.totalCount : undefined,
        }))
      : [];
  }

  private mapKeywords(keywords: SparqueKeywordSuggestions[]): string[] {
    return keywords ? keywords.map(entry => entry.keyword) : [];
  }
}
