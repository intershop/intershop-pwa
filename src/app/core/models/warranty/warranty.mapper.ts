import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Link } from 'ish-core/models/link/link.model';
import { PriceMapper } from 'ish-core/models/price/price.mapper';

import { WarrantyData } from './warranty.interface';
import { Warranty } from './warranty.model';

export class WarrantyMapper {
  static fromData(warData: WarrantyData): Warranty {
    if (warData) {
      return {
        id: warData.sku,
        name: warData.name,
        price: PriceMapper.fromData(warData.price),
        shortDescription: warData.shortDescription,
        longDescription: warData.longDescription,
        years: AttributeHelper.getAttributeValueByAttributeName(warData.attributes, 'Number of years'),
        timePeriod: AttributeHelper.getAttributeValueByAttributeName(warData.attributes, 'WarrantyTimePeriod'),
        type: AttributeHelper.getAttributeValueByAttributeName(warData.attributes, 'WarrantyType'),
        code: AttributeHelper.getAttributeValueByAttributeName(warData.attributes, 'WarrantyCode'),
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
