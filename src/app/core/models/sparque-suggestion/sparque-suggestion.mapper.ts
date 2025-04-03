import { Injectable } from '@angular/core';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Category } from 'ish-core/models/category/category.model';
import { Image } from 'ish-core/models/image/image.model';
import { SparqueMapper } from 'ish-core/models/sparque/sparque.mapper';
import { Brand, ContentSuggestion, Suggestion } from 'ish-core/models/suggestion/suggestion.model';

import {
  SparqueBrand,
  SparqueCategory,
  SparqueContentSuggestions,
  SparqueKeywordSuggestions,
  SparqueSuggestions,
} from './sparque-suggestion.interface';

@Injectable({ providedIn: 'root' })
export class SparqueSuggestionMapper {
  private categoryUniqueIds: string[];

  constructor(private shoppingFacade: ShoppingFacade, private sparqueMapper: SparqueMapper) {
    this.shoppingFacade.categoryNodes$.subscribe(nodes => (this.categoryUniqueIds = Object.keys(nodes)));
  }

  fromData(suggestion: SparqueSuggestions): Suggestion {
    return suggestion
      ? {
          products: this.sparqueMapper.mapProducts(suggestion.products),
          categories: this.mapCategories(suggestion.categories),
          brands: this.mapBrands(suggestion.brands),
          keywordSuggestions: this.mapKeywords(suggestion.keywordSuggestions),
          contentSuggestions: this.mapContent(suggestion.contentSuggestions),
        }
      : undefined;
  }

  private mapCategories(categories: SparqueCategory[]): Category[] {
    return categories
      ? categories.map(category => ({
          name: category.categoryName ? category.categoryName : undefined,
          uniqueId: category.categoryID ? this.getUniqueCategoryId(category.categoryID) : undefined,
          categoryRef: category.categoryURL ? category.categoryURL : undefined,
          categoryPath: category.parentCategoryId
            ? [category.parentCategoryId, category.categoryID ? category.categoryID : undefined]
            : category.categoryID
            ? [category.categoryID]
            : [],
          hasOnlineProducts: category.totalCount && category.totalCount > 0,
          description: undefined,
          images: category.attributes ? this.extractImageUrl(category.attributes) : undefined,
          attributes: this.sparqueMapper.mapAttributes(category.attributes),
          completenessLevel: 0,
          productCount: category.totalCount ? category.totalCount : undefined,
        }))
      : [];
  }

  private getUniqueCategoryId(categoryId: string): string {
    const hits = this.categoryUniqueIds.filter(id => id.endsWith(categoryId));
    return hits.length > 0 ? hits[0] : categoryId;
  }

  private mapBrands(brands: SparqueBrand[]): Brand[] {
    return brands
      ? brands.map(brand => ({
          name: brand.brandName ? brand.brandName : undefined,
          imageUrl: brand.imageUrl ? brand.imageUrl : undefined,
          productCount: brand.totalCount ? brand.totalCount : undefined,
        }))
      : undefined;
  }

  private mapKeywords(keywords: SparqueKeywordSuggestions[]): string[] {
    return keywords ? keywords.map(entry => entry.keyword) : [];
  }

  private mapContent(contentSuggestions: SparqueContentSuggestions[]): ContentSuggestion[] {
    return contentSuggestions
      ? contentSuggestions.map(content => ({
          newsType: content.newsType ? content.newsType : undefined,
          paragraph: content.paragraph ? content.paragraph : undefined,
          slug: content.slug ? content.slug : undefined,
          summary: content.summary ? content.summary : undefined,
          title: content.title ? content.title : undefined,
          type: content.type ? content.type : undefined,
          articleDate: content.articleDate ? content.articleDate : undefined,
        }))
      : undefined;
  }

  private extractImageUrl(attributes: { name: string; value: string }[]): Image[] {
    const imageAttribute = attributes.find(attr => attr.name === 'image');
    return imageAttribute
      ? [
          {
            name: undefined,
            viewID: undefined,
            typeID: undefined,
            imageActualHeight: undefined,
            imageActualWidth: undefined,
            effectiveUrl: imageAttribute.value
              ? `${this.sparqueMapper.getStaticURL()}/${imageAttribute.value}`
              : undefined,
            type: undefined,
            primaryImage: true,
          },
        ]
      : [];
  }
}
