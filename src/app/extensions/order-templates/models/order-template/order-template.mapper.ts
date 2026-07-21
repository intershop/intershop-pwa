import { Injectable } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Link } from 'ish-core/models/link/link.model';

import { OrderTemplateData } from './order-template.interface';
import { OrderTemplate, OrderTemplateItem } from './order-template.model';

@Injectable({ providedIn: 'root' })
export class OrderTemplateMapper {
  private static parseIdFromURI(uri: string): string {
    const match = /wishlists[^/]*\/([^?]*)/.exec(uri);
    if (match) {
      return match[1];
    } else {
      console.warn(`could not find id in uri '${uri}'`);
      return;
    }
  }

  fromData(orderTemplateData: OrderTemplateData, orderTemplateId: string): OrderTemplate {
    if (orderTemplateData) {
      let items: OrderTemplateItem[];
      if (orderTemplateData.items?.length) {
        items = orderTemplateData.items.map(item => ({
          sku: AttributeHelper.getAttributeValueByAttributeName(item.attributes, 'sku'),
          id: AttributeHelper.getAttributeValueByAttributeName(item.attributes, 'id'),
          creationDate: Number(AttributeHelper.getAttributeValueByAttributeName(item.attributes, 'creationDate')),
          desiredQuantity: {
            value: AttributeHelper.getAttributeValueByAttributeName<Attribute<number>>(
              item.attributes,
              'desiredQuantity'
            ).value,
            // TBD: is the unit necessary?
            // unit: item.desiredQuantity.unit,
          },
        }));
      } else {
        items = [];
      }

      return {
        id: orderTemplateId,
        title: orderTemplateData.title,
        itemsCount: orderTemplateData.itemsCount || 0,
        creationDate: orderTemplateData.creationDate,
        items,
      };
    } else {
      throw new Error(`orderTemplateData is required`);
    }
  }

  fromListData(orderTemplateLinks: Link[]): OrderTemplate[] {
    if (!orderTemplateLinks) {
      return [];
    }
    return orderTemplateLinks.map(orderTemplateLink => ({
      id: orderTemplateLink.itemId,
      title: orderTemplateLink.title,
      itemsCount: AttributeHelper.getAttributeValueByAttributeName<number>(orderTemplateLink.attributes, 'itemsCount'),
      creationDate: AttributeHelper.getAttributeValueByAttributeName<number>(
        orderTemplateLink.attributes,
        'creationDate'
      ),
    }));
  }

  /**
   * extract ID from URI
   */
  fromDataToId(orderTemplateData: OrderTemplateData): string {
    return orderTemplateData ? OrderTemplateMapper.parseIdFromURI(orderTemplateData.uri) : undefined;
  }

  fromUpdate(orderTemplate: OrderTemplate, id: string): OrderTemplate {
    if (orderTemplate && id) {
      return {
        id,
        title: orderTemplate.title,
        creationDate: orderTemplate.creationDate,
      };
    }
  }
}
