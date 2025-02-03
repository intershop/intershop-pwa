import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Category } from 'ish-core/models/category/category.model';
import { Image } from 'ish-core/models/image/image.model';
import { Product } from 'ish-core/models/product/product.model';
import { Brand, ContentSuggestion, Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { getStaticEndpoint } from 'ish-core/store/core/configuration';

import {
  SparqueAttribute,
  SparqueBrand,
  SparqueCategory,
  SparqueContentSuggestions,
  SparqueImage,
  SparqueKeywordSuggestions,
  SparqueProduct,
  SparqueSuggestions,
} from './sparque-suggestion.interface';

@Injectable({ providedIn: 'root' })
export class SparqueSuggestionMapper {
  private icmStaticURL: string;

  constructor(store: Store) {
    store.pipe(select(getStaticEndpoint)).subscribe(url => (this.icmStaticURL = url));
  }

  fromData(suggestion: SparqueSuggestions): Suggestion {
    return suggestion
      ? {
          products: this.mapProducts(suggestion.products),
          categories: this.mapCategories(suggestion.categories),
          brands: this.mapBrands(suggestion.brands),
          keywordSuggestions: this.mapKeywords(suggestion.keywordSuggestions),
          contentSuggestions: this.mapContent(suggestion.contentSuggestions),
        }
      : undefined;
  }

  mapProducts(products: SparqueProduct[]): Product[] {
    return products
      ? products.map(product => ({
          name: product.name ? product.name : undefined,
          shortDescription: product.shortDescription ? product.shortDescription : undefined,
          longDescription: product.longDescription ? product.longDescription : undefined,
          available: true,
          manufacturer: product.manufacturer ? product.manufacturer : undefined,
          images: this.mapImages(product.images),
          attributes: this.mapAttributes(product.attributes),
          sku: product.sku ? product.sku : undefined,
          defaultCategoryId: product.defaultcategoryId ? product.defaultcategoryId : undefined,
          completenessLevel: 0,
          maxOrderQuantity: undefined,
          minOrderQuantity: undefined,
          stepQuantity: undefined,
          roundedAverageRating: undefined,
          numberOfReviews: undefined,
          readyForShipmentMin: undefined,
          readyForShipmentMax: undefined,
          packingUnit: undefined,
          type: undefined,
          promotionIds: undefined,
          failed: false,
        }))
      : undefined;
  }

  mapCategories(categories: SparqueCategory[]): Category[] {
    return categories
      ? categories.map(category => ({
          name: category.categoryName ? category.categoryName : undefined,
          uniqueId: category.CategoryID ? category.CategoryID : undefined,
          categoryRef: category.CategoryURL ? category.CategoryURL : undefined,
          categoryPath: category.ParentCategoryId
            ? [category.ParentCategoryId, category.CategoryID ? category.CategoryID : undefined]
            : category.CategoryID
            ? [category.CategoryID]
            : [],
          hasOnlineProducts: category.totalCount && category.totalCount > 0,
          description: undefined,
          images: this.extractImageUrl(category.attributes),
          attributes: this.mapAttributes(category.attributes),
          completenessLevel: 0,
          productCount: category.totalCount ? category.totalCount : undefined,
        }))
      : [];
  }

  mapBrands(brands: SparqueBrand[]): Brand[] {
    return brands
      ? brands.map(brand => ({
          name: brand.brandName ? brand.brandName : undefined,
          imageUrl: brand.imageUrl ? brand.imageUrl : undefined,
          productCount: brand.totalCount ? brand.totalCount : undefined,
        }))
      : undefined;
  }

  mapKeywords(keywords: SparqueKeywordSuggestions[]): string[] {
    return keywords ? keywords.map(entry => entry.keyword) : [];
  }

  mapContent(contentSuggestions: SparqueContentSuggestions[]): ContentSuggestion[] {
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

  mapAttributes(attributes: SparqueAttribute[]): Attribute[] {
    return attributes ? attributes.map(attribute => ({ name: attribute.name, value: attribute.value })) : [];
  }

  mapImages(images: SparqueImage[]): Image[] {
    return images
      ? images.map(image => ({
          name: image.id ? image.id : undefined,
          type: undefined,
          effectiveUrl: image.url ? image.url : undefined,
          viewID: image.id ? image.id : undefined,
          typeID: undefined,
          primaryImage: image.isPrimaryImage ? image.isPrimaryImage : false,
          imageActualHeight: undefined,
          imageActualWidth: undefined,
        }))
      : [];
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
            effectiveUrl: `${this.icmStaticURL}/${imageAttribute.value}`,
            type: undefined,
            primaryImage: true,
          },
        ]
      : [];
  }
}
