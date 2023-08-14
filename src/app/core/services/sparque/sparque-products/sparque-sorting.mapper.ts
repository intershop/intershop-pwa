import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { SparqueResponse } from 'ish-core/models/sparque/sparque.interface';

export class SparqueSortingMapper {
  static fromData(data: SparqueResponse, locale: string): SortableAttributesType[] {
    return data.items.map(item => ({
      name: item.tuple[0].attributes.identifier[0],
      displayName: item.tuple[0].attributes.title[locale.replace('_', '-')][0], // item.tuple[0].attributes.identifier[0],
      direction: 'asc',
    }));
  }
}
