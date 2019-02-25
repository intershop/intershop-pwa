import { Injectable } from '@angular/core';

import { ContentConfigurationParameterMapper } from '../content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentSlotData } from '../content-slot/content-slot.interface';
import { ContentSlot } from '../content-slot/content-slot.model';

import { ContentPageletData } from './content-pagelet.interface';
import { ContentPagelet } from './content-pagelet.model';

@Injectable({ providedIn: 'root' })
export class ContentPageletMapper {
  constructor(private contentConfigurationParameterMapper: ContentConfigurationParameterMapper) {}

  fromData(data: ContentPageletData): ContentPagelet[] {
    if (!data) {
      throw new Error('falsy input');
    }

    const { definitionQualifiedName, id } = data;
    const configurationParameters = this.contentConfigurationParameterMapper.fromData(data.configurationParameters);

    let slots: ContentSlot[] = [];
    let pagelets: ContentPagelet[] = [];
    if (data.slots) {
      const deep = Object.values(data.slots).map(x => this.fromSlotData(x));
      slots = deep.map(val => val.slot);
      pagelets = deep.map(val => val.pagelets).reduce((acc, val) => [...acc, ...val]);
    }

    return [
      {
        configurationParameters,
        definitionQualifiedName,
        id,
        slots,
      },
      ...pagelets,
    ];
  }

  private fromSlotData(data: ContentSlotData): { slot: ContentSlot; pagelets: ContentPagelet[] } {
    if (!data) {
      throw new Error('falsy input');
    }

    const definitionQualifiedName = data.definitionQualifiedName;
    const configurationParameters = this.contentConfigurationParameterMapper.fromData(data.configurationParameters);
    const pageletIDs = !data.pagelets ? [] : data.pagelets.map(pagelet => pagelet.id);

    const slot: ContentSlot = {
      definitionQualifiedName,
      configurationParameters,
      pageletIDs,
    };

    const pagelets = !data.pagelets
      ? []
      : data.pagelets.map(x => this.fromData(x)).reduce((acc, val) => [...acc, ...val], []);

    return { slot, pagelets };
  }
}
