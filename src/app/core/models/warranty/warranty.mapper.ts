import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Link } from 'ish-core/models/link/link.model';
import { PriceMapper } from 'ish-core/models/price/price.mapper';

import { WarrantyData } from './warranty.interface';
import { Warranty } from './warranty.model';

export class WarrantyMapper {
  static fromData(data: WarrantyData): Warranty {
    if (data) {
      return {
        id: data.sku,
        name: data.name,
        price: { type: 'Money', value: data.price, currency: data.currencyCode },
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        attributes: data.attributes,
      };
    } else {
      throw new Error(`'WarrantyData' is required for the mapping`);
    }
  }

  static fromLinkData(warrantyLinks: Link[] = []): Warranty[] {
    const warranties: Warranty[] = [];

    warrantyLinks.map(linkData =>
      warranties.push({
        id: linkData.uri.slice(linkData.uri.lastIndexOf('/') + 1),
        name: linkData.title,
        price: PriceMapper.fromData(
          AttributeHelper.getAttributeValueByAttributeName(linkData.attributes, 'WarrantyPrice')
        ),
      })
    );

    return warranties;
  }
}
