import { ContentConfigurationParameterMapper } from '../content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentSlotData } from '../content-slot/content-slot.interface';
import { ContentSlot } from '../content-slot/content-slot.model';

import { ContentPageletData } from './content-pagelet.interface';
import { ContentPagelet } from './content-pagelet.model';

export class ContentPageletMapper {
  static fromData(data: ContentPageletData): ContentPagelet[] {
    if (!data) {
      throw new Error('falsy input');
    }

    const { definitionQualifiedName, displayName, id } = data;
    const configurationParameters = ContentConfigurationParameterMapper.fromData(data.configurationParameters);

    let slots: ContentSlot[] = [];
    let pagelets: ContentPagelet[] = [];
    if (!!data.slots) {
      const deep = Object.values(data.slots).map(ContentPageletMapper.fromSlotData);
      slots = deep.map(val => val.slot);
      pagelets = deep.map(val => val.pagelets).reduce((acc, val) => [...acc, ...val]);
    }

    return [
      {
        configurationParameters,
        definitionQualifiedName,
        displayName,
        id,
        slots,
      },
      ...pagelets,
    ];
  }

  private static fromSlotData(data: ContentSlotData): { slot: ContentSlot; pagelets: ContentPagelet[] } {
    if (!data) {
      throw new Error('falsy input');
    }

    const definitionQualifiedName = data.definitionQualifiedName;
    const configurationParameters = ContentConfigurationParameterMapper.fromData(data.configurationParameters);
    const pageletIDs = !data.pagelets ? [] : data.pagelets.map(pagelet => pagelet.id);

    const slot: ContentSlot = {
      definitionQualifiedName,
      configurationParameters,
      pageletIDs,
    };

    const pagelets = !data.pagelets
      ? []
      : data.pagelets.map(ContentPageletMapper.fromData).reduce((acc, val) => [...acc, ...val], []);

    return { slot, pagelets };
  }
}
