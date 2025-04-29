import { Injectable } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Category } from 'ish-core/models/category/category.model';
import { SparqueCategory } from 'ish-core/models/sparque-category/sparque-category.interface';
import { SparqueImageMapper } from 'ish-core/models/sparque-image/sparque-image.mapper';
import { SparqueOfferMapper } from 'ish-core/models/sparque-offer/sparque-offer.mapper';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';

import { SparqueSuggestions } from './sparque-suggestions.interface';

@Injectable({ providedIn: 'root' })
export class SparqueSuggestionsMapper {
  constructor(
    private sparqueProductMapper: SparqueProductMapper,
    private sparqueImageMapper: SparqueImageMapper,
    private sparqueOfferMapper: SparqueOfferMapper
  ) {}

  fromData(suggestions: SparqueSuggestions): Suggestions {
    return {
      products: suggestions?.products ? this.sparqueProductMapper.mapProducts(suggestions.products) : [],
      categories: suggestions?.categories ? this.mapCategories(suggestions.categories) : [],
      brands: suggestions?.brands ? suggestions.brands : [],
      keywords: suggestions?.keywordSuggestions ? suggestions.keywordSuggestions : [],
      prices: suggestions?.products ? this.sparqueOfferMapper.mapOffers(suggestions.products) : [],
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
}
