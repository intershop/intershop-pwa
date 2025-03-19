import { Injectable } from '@angular/core';
import { concatLatestFrom } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Category } from 'ish-core/models/category/category.model';
import { ImageMapper } from 'ish-core/models/image/image.mapper';
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
  private categoryUniqueIds: string[];

  constructor(private imageMapper: ImageMapper, private shoppingFacade: ShoppingFacade, private store: Store) {}

  private getServerData(): void {
    this.store
      .pipe(
        select(getStaticEndpoint),
        concatLatestFrom(() => [this.shoppingFacade.categoryNodes$]),
        take(1)
      )
      .subscribe(([url, nodes]) => {
        this.icmStaticURL = url;
        this.categoryUniqueIds = Object.keys(nodes);
      });
  }

  fromData(suggestion: SparqueSuggestions): Suggestion {
    this.getServerData();
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

  private mapProducts(products: SparqueProduct[]): Product[] {
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
          attributes: this.mapAttributes(category.attributes),
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

  private mapAttributes(attributes: SparqueAttribute[]): Attribute[] {
    return attributes ? attributes.map(attribute => ({ name: attribute.name, value: attribute.value })) : [];
  }

  private mapImages(images: SparqueImage[]): Image[] {
    const urlOfPrimaryImage = this.getUrlOfPrimaryImage(images).startsWith('/')
      ? this.getUrlOfPrimaryImage(images)
      : `/${this.getUrlOfPrimaryImage(images)}`;

    return this.imageMapper.fromImageUrl(this.icmStaticURL.concat(urlOfPrimaryImage));
  }

  private getUrlOfPrimaryImage(images: SparqueImage[]): string {
    const noImageImageUrl = '/assets/img/not-available.svg';
    const primaryImage = images?.find(image => image.isPrimaryImage);
    return primaryImage ? primaryImage.id : noImageImageUrl;
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
            effectiveUrl: imageAttribute.value ? `${this.icmStaticURL}/${imageAttribute.value}` : undefined,
            type: undefined,
            primaryImage: true,
          },
        ]
      : [];
  }
}
