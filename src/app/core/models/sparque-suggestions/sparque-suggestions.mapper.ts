import { Injectable } from '@angular/core';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { SparqueCategoryMapper } from 'ish-core/models/sparque-category/sparque-category.mapper';
import { SparqueOfferMapper } from 'ish-core/models/sparque-offer/sparque-offer.mapper';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';

import { SparqueSuggestions } from './sparque-suggestions.interface';

@Injectable({ providedIn: 'root' })
export class SparqueSuggestionsMapper {
  constructor(
    private sparqueCategoryMapper: SparqueCategoryMapper,
    private sparqueProductMapper: SparqueProductMapper
  ) {}

  fromData(data: SparqueSuggestions): [Suggestions, CategoryTree] {
    if (!data) {
      return [undefined, undefined];
    }

    const result = this.sparqueCategoryMapper.fromSuggestionsData(data.categories);
    const categories = result.categoryIds;
    const categoryTree = result.categoryTree;

    const suggestions = {
      keywords: data.keywordSuggestions ?? [],
      brands: data.brands ?? [],
      categories,
      products: this.sparqueProductMapper.mapProducts(data.products),
      prices: SparqueOfferMapper.mapOffers(data.products),
    };

    return [suggestions, categoryTree];
  }
}
