import { Injectable } from '@angular/core';

import { ContentConfigurationParameterMapper } from 'ish-core/models/content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentSlotData } from 'ish-core/models/content-slot/content-slot.interface';
import { ContentSlot } from 'ish-core/models/content-slot/content-slot.model';

import { ContentPageletData } from './content-pagelet.interface';
import { ContentPagelet } from './content-pagelet.model';

@Injectable({ providedIn: 'root' })
export class ContentPageletMapper {
  constructor(private contentConfigurationParameterMapper: ContentConfigurationParameterMapper) {}

  fromData(data: ContentPageletData, context?: string): ContentPagelet[] {
    if (!data) {
      throw new Error('falsy input');
    }

    const { definitionQualifiedName, id, domain, displayName } = data;
    const configurationParameters = this.contentConfigurationParameterMapper.fromData(data.configurationParameters);

    let slots: ContentSlot[] = [];
    let pagelets: ContentPagelet[] = [];
    if (data.slots) {
      const deep = Object.values(data.slots).map((slot, index) =>
        this.fromSlotData(slot, this.appendContext(`$${index}@${id}`, context))
      );
      slots = deep.map(val => val.slot);
      pagelets = deep.map(val => val.pagelets).reduce((acc, val) => [...acc, ...val]);
    }

    return [
      {
        configurationParameters,
        definitionQualifiedName,
        id: this.appendContext(id, context),
        slots,
        domain,
        displayName,
      },
      ...pagelets,
    ];
  }

  private fromSlotData(data: ContentSlotData, context: string): { slot: ContentSlot; pagelets: ContentPagelet[] } {
    if (!data) {
      throw new Error('falsy input');
    }

    const definitionQualifiedName = data.definitionQualifiedName;
    const configurationParameters = this.contentConfigurationParameterMapper.fromData(data.configurationParameters);
    const pageletIDs = !data.pagelets
      ? []
      : data.pagelets.map((pagelet, index) => this.appendContext(`${pagelet.id}#${index}`, context));
    const displayName = data.displayName;

    const slot: ContentSlot = {
      definitionQualifiedName,
      configurationParameters,
      pageletIDs,
      displayName,
    };

    const pagelets = !data.pagelets
      ? []
      : data.pagelets
          .map((pagelet, index) => this.fromData(pagelet, this.appendContext(`#${index}`, context)))
          .reduce((acc, val) => [...acc, ...val], []);

    return { slot, pagelets };
  }

  /**
   * Append the context string to the id if given (needed for normalizing of component templates).
   */
  private appendContext(id: string, context?: string): string {
    return context ? `${id}${context}` : id;
  }
}
