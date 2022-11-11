/* eslint-disable ish-custom-rules/project-structure */
import { Injectable } from '@angular/core';

import { ImageMapper } from 'ish-core/models/image/image.mapper';

import { VariationAttributeData, VariationAttributeMetaData } from './variation-attribute.interface';
import { VariationAttribute, VariationAttributeType } from './variation-attribute.model';

/**
 * Maps variation attributes data of HTTP requests to client side model instance.
 */
@Injectable({ providedIn: 'root' })
export class VariationAttributeMapper {
  constructor(private imageMapper: ImageMapper) {}

  fromData(data: VariationAttributeData[]): VariationAttribute[] {
    return data?.map(varAttr => ({
      variationAttributeId: varAttr.variationAttributeId,
      name: varAttr.name,
      value: varAttr.value.value,
      attributeType: varAttr.attributeType,
      metaData: this.mapMetaData(varAttr.attributeType, varAttr.metadata),
    }));
  }

  fromMasterData(variationAttributes: VariationAttributeData[]): VariationAttribute[] {
    return variationAttributes
      ?.map(varAttr =>
        varAttr.values.map(value => ({
          variationAttributeId: varAttr.variationAttributeId,
          name: varAttr.name,
          value: value.value.value,
          attributeType: varAttr.attributeType,
          metaData: this.mapMetaData(varAttr.attributeType, value.metadata),
        }))
      )
      .flat();
  }

  private mapMetaData(attributeType: VariationAttributeType, metaData: VariationAttributeMetaData): string {
    switch (attributeType) {
      case 'colorCode':
      case 'defaultAndColorCode':
        return metaData?.colorCode;
      case 'swatchImage':
      case 'defaultAndSwatchImage':
        return this.imageMapper.fromEffectiveUrl(metaData?.imagePath);
      default:
        return;
    }
  }
}
