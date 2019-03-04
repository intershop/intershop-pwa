import { Injectable } from '@angular/core';

import { ContentConfigurationParameterMapper } from '../content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentPageletMapper } from '../content-pagelet/content-pagelet.mapper';
import { ContentPagelet } from '../content-pagelet/content-pagelet.model';

import { ContentEntryPointData } from './content-entry-point.interface';
import { ContentEntryPoint } from './content-entry-point.model';

@Injectable({ providedIn: 'root' })
export class ContentEntryPointMapper {
  constructor(
    private contentConfigurationParameterMapper: ContentConfigurationParameterMapper,
    private contentPageletMapper: ContentPageletMapper
  ) {}

  /**
   * Converts {@link ContentEntryPointData} to the model entity {@link ContentEntryPoint} and enclosed {@link ContentPagelet}s.
   */
  fromData(data: ContentEntryPointData): { contentEntryPoint: ContentEntryPoint; pagelets: ContentPagelet[] } {
    if (!data) {
      throw new Error('falsy input');
    }

    let pagelets: ContentPagelet[] = [];
    let pageletIDs: string[] = [];

    if (data.pagelets) {
      pageletIDs = data.pagelets.map(p => p.id);
      pagelets = data.pagelets
        .map(x => this.contentPageletMapper.fromData(x))
        .reduce((acc, val) => [...acc, ...val], []);
    }

    const configurationParameters = this.contentConfigurationParameterMapper.fromData(data.configurationParameters);

    const contentEntryPoint: ContentEntryPoint = {
      id: data.link.title,
      definitionQualifiedName: data.definitionQualifiedName,
      displayName: data.displayName,
      pageletIDs,
      configurationParameters,
    };

    return { contentEntryPoint, pagelets };
  }
}
