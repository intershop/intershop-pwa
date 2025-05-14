import { Injectable } from '@angular/core';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { Product } from 'ish-core/models/product/product.model';
import { SparqueCategoryMapper } from 'ish-core/models/sparque-category/sparque-category.mapper';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';

import { SparqueSuggestions } from './sparque-suggestions.interface';

@Injectable({ providedIn: 'root' })
export class SparqueSuggestionsMapper {
  constructor(
    private sparqueCategoryMapper: SparqueCategoryMapper,
    private sparqueProductMapper: SparqueProductMapper
  ) {}

  fromData(data: SparqueSuggestions): [Suggestions?, CategoryTree?, Partial<Product>[]?] {
    if (!data) {
      return [];
    }

    const mappedCategories = this.sparqueCategoryMapper.fromSuggestionsData(data.categories);
    const categories = mappedCategories.categoryIds;
    const categoryTree = mappedCategories.categoryTree;

    const mappedProducts = this.sparqueProductMapper.fromSuggestionsData(data.products);
    const products = mappedProducts.productSkus;
    const productsArray = mappedProducts.products;

    const suggestions = {
      keywords: data.keywordSuggestions ?? [],
      brands: data.brands ?? [],
      categories,
      products,
    };

    return [suggestions, categoryTree, productsArray];
  }
}
