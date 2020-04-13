import { Injectable } from '@angular/core';

import { OrderTemplateData } from './order-template.interface';
import { OrderTemplate, OrderTemplateItem } from './order-template.model';

@Injectable({ providedIn: 'root' })
export class OrderTemplateMapper {
  private static parseIDfromURI(uri: string): string {
    const match = /wishlists[^\/]*\/([^\?]*)/.exec(uri);
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
      if (orderTemplateData.items && orderTemplateData.items.length) {
        // create items object from attribute array
        const arrayToObject = attributes =>
          attributes.reduce((obj, attr) => {
            obj[attr.name] = attr.value;
            return obj;
          }, {});
        items = orderTemplateData.items
          .map(item => arrayToObject(item.attributes))
          .map(item => ({
            sku: item.sku,
            id: item.id,
            creationDate: Number(item.creationDate),
            desiredQuantity: {
              value: item.desiredQuantity.value,
              // TBD: is the unit necessarry?
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

  fromUpdate(orderTemplate: OrderTemplate, id: string): OrderTemplate {
    if (orderTemplate && id) {
      return {
        id,
        title: orderTemplate.title,
        creationDate: orderTemplate.creationDate,
      };
    }
  }

  // extract ID from URI
  fromDataToIds(orderTemplateData: OrderTemplateData): OrderTemplate {
    if (orderTemplateData) {
      return {
        id: OrderTemplateMapper.parseIDfromURI(orderTemplateData.uri),
        title: orderTemplateData.title,
      };
    }
  }
}
