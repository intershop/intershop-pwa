import { Injectable } from '@angular/core';

import { ContentConfigurationParameterMapper } from 'ish-core/models/content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentPageletEntryPointData } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.interface';
import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPageletMapper } from 'ish-core/models/content-pagelet/content-pagelet.mapper';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';

@Injectable({ providedIn: 'root' })
export class ContentPageletEntryPointMapper {
  constructor(
    private contentConfigurationParameterMapper: ContentConfigurationParameterMapper,
    private contentPageletMapper: ContentPageletMapper
  ) {}

  /**
   * Converts {@link ContentPageletEntryPointData} to the model entity {@link ContentPageletEntryPoint} and enclosed {@link ContentPagelet}s.
   */
  fromData(data: ContentPageletEntryPointData): [ContentPageletEntryPoint, ContentPagelet[]] {
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

    const pageletEntryPoint: ContentPageletEntryPoint = {
      id: data.id,
      definitionQualifiedName: data.definitionQualifiedName,
      displayName: data.displayName,
      domain: data.domain,
      resourceSetId: data.resourceSetId,
      pageletIDs,
      configurationParameters,
    };

    return [pageletEntryPoint, pagelets];
  }
}
