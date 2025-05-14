import { Injectable } from '@angular/core';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { Product } from 'ish-core/models/product/product.model';
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

  fromData(data: SparqueSuggestions): {
    suggestions: Suggestions;
    categories?: CategoryTree;
    products?: Partial<Product>[];
  } {
    if (!data) {
      return;
    }

    const mappedCategories = this.sparqueCategoryMapper.fromSuggestionsData(data.categories);
    const categoryIds = mappedCategories.categoryIds;
    const categories = mappedCategories.categoryTree;

    const mappedProducts = this.sparqueProductMapper.fromSuggestionsData(data.products);
    const productSkus = mappedProducts.productSkus;
    const products = mappedProducts.products;

    const suggestions = {
      keywords: data.keywordSuggestions ?? [],
      brands: data.brands ?? [],
      categories: categoryIds,
      products: productSkus,
      prices: SparqueOfferMapper.mapOffers(data.products),
    };

    return { suggestions, categories, products };
  }
}
