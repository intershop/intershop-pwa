import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Category } from 'ish-core/models/category/category.model';
import { Image } from 'ish-core/models/image/image.model';
import { Product } from 'ish-core/models/product/product.model';
import { Brand, ContentSuggestion, Suggestion } from 'ish-core/models/suggestion/suggestion.model';

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

function mapProducts(products: SparqueProduct[]): Product[] {
  return products
    ? products.map(product => ({
        name: product.name ? product.name : undefined,
        shortDescription: product.shortDescription ? product.shortDescription : undefined,
        longDescription: product.longDescription ? product.longDescription : undefined,
        available: true,
        manufacturer: product.manufacturer ? product.manufacturer : undefined,
        images: mapImages(product.images),
        attributes: mapAttributes(product.attributes),
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

function mapCategories(categories: SparqueCategory[]): Category[] {
  return categories
    ? categories.map(category => ({
        name: category.CategoryName ? category.CategoryName : undefined,
        uniqueId: category.CategoryID ? category.CategoryID : undefined,
        categoryRef: category.CategoryURL ? category.CategoryURL : undefined,
        categoryPath: category.ParentCategoryId
          ? [category.ParentCategoryId, category.CategoryID ? category.CategoryID : undefined]
          : category.CategoryID
          ? [category.CategoryID]
          : [],
        hasOnlineProducts: category.TotalCount && category.TotalCount > 0,
        description: undefined,
        images: mapImages([]),
        attributes: mapAttributes(category.attributes),
        completenessLevel: 0,
      }))
    : [];
}

function mapBrands(brands: SparqueBrand[]): Brand[] {
  return brands
    ? brands.map(brand => ({
        name: brand.brandName ? brand.brandName : undefined,
        imageUrl: brand.imageUrl ? brand.imageUrl : undefined,
        productCount: brand.totalCount ? brand.totalCount : undefined,
      }))
    : undefined;
}

function mapKeywords(keywords: SparqueKeywordSuggestions[]): string[] {
  return keywords ? keywords.map(entry => entry.keyword) : [];
}

function mapContent(contentSuggestions: SparqueContentSuggestions[]): ContentSuggestion[] {
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

function mapAttributes(attributes: SparqueAttribute[]): Attribute[] {
  return attributes ? attributes.map(attribute => ({ name: attribute.name, value: attribute.value })) : [];
}

function mapImages(images: SparqueImage[]): Image[] {
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

export class SparqueSuggestionMapper {
  static fromData(suggestion: SparqueSuggestions): Suggestion {
    return suggestion
      ? {
          products: mapProducts(suggestion.products),
          categories: mapCategories(suggestion.categories),
          brands: mapBrands(suggestion.brands),
          keywordSuggestions: mapKeywords(suggestion.keywordSuggestions),
          contentSuggestions: mapContent(suggestion.contentSuggestions),
        }
      : undefined;
  }
}
