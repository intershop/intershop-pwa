import { ContentConfigurationParameterMapper } from '../content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentPageletMapper } from '../content-pagelet/content-pagelet.mapper';
import { ContentPagelet } from '../content-pagelet/content-pagelet.model';

import { ContentIncludeData } from './content-include.interface';
import { ContentInclude } from './content-include.model';

export class ContentIncludeMapper {
  /**
   * Converts {@link ContentIncludeData} to the model entity {@link ContentInclude} and enclosed {@link ContentPagelet}s.
   */
  static fromData(data: ContentIncludeData): { include: ContentInclude; pagelets: ContentPagelet[] } {
    if (!data) {
      throw new Error('falsy input');
    }

    let pagelets: ContentPagelet[] = [];
    let pageletIDs: string[] = [];

    if (!!data.pagelets) {
      pageletIDs = data.pagelets.map(p => p.id);
      pagelets = data.pagelets.map(ContentPageletMapper.fromData).reduce((acc, val) => [...acc, ...val], []);
    }

    const configurationParameters = ContentConfigurationParameterMapper.fromData(data.configurationParameters);

    const include: ContentInclude = {
      id: data.link.title,
      displayName: data.displayName,
      configurationParameters,
      pageletIDs,
    };

    return { include, pagelets };
  }
}
