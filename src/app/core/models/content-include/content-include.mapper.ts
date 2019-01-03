import { Injectable } from '@angular/core';

import { ContentConfigurationParameterMapper } from '../content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentPageletMapper } from '../content-pagelet/content-pagelet.mapper';
import { ContentPagelet } from '../content-pagelet/content-pagelet.model';

import { ContentIncludeData } from './content-include.interface';
import { ContentInclude } from './content-include.model';

@Injectable({ providedIn: 'root' })
export class ContentIncludeMapper {
  constructor(
    private contentConfigurationParameterMapper: ContentConfigurationParameterMapper,
    private contentPageletMapper: ContentPageletMapper
  ) {}

  /**
   * Converts {@link ContentIncludeData} to the model entity {@link ContentInclude} and enclosed {@link ContentPagelet}s.
   */
  fromData(data: ContentIncludeData): { include: ContentInclude; pagelets: ContentPagelet[] } {
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

    const include: ContentInclude = {
      id: data.link.title,
      definitionQualifiedName: data.definitionQualifiedName,
      configurationParameters,
      pageletIDs,
    };

    return { include, pagelets };
  }
}
