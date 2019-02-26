import { Injectable } from '@angular/core';

import { ContentConfigurationParameterMapper } from '../content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentPageData } from '../content-page/content-page.interface';
import { ContentPageletMapper } from '../content-pagelet/content-pagelet.mapper';
import { ContentPagelet } from '../content-pagelet/content-pagelet.model';

import { ContentPage } from './content-page.model';

@Injectable({ providedIn: 'root' })
export class ContentPageMapper {
  constructor(
    private contentConfigurationParameterMapper: ContentConfigurationParameterMapper,
    private contentPageletMapper: ContentPageletMapper
  ) {}

  /**
   * Converts {@link ContentIncludeData} to the model entity {@link ContentInclude} and enclosed {@link ContentPagelet}s.
   */
  fromData(data: ContentPageData): { page: ContentPage; pagelets: ContentPagelet[] } {
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

    const page: ContentPage = {
      id: data.link.title,
      displayName: data.displayName,
      link: data.link,
      definitionQualifiedName: data.definitionQualifiedName,
      configurationParameters,
      pageletIDs,
    };

    return { page, pagelets };
  }
}
