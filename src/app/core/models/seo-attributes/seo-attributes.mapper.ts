import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';

import { SeoAttributesData } from './seo-attributes.interface';
import { SeoAttributes } from './seo-attributes.model';

export class SeoAttributesMapper {
  static fromData(data: SeoAttributesData): SeoAttributes {
    if (data) {
      return {
        title: data.metaTitle,
        description: data.metaDescription,
        robots: data.robots?.join(', '),
      };
    }
  }

  static fromCMSData(data: ContentPagelet): SeoAttributes {
    if (data) {
      const robots = [
        data.configurationParameters?.RobotsNoIndex === 'true' ? 'noindex' : 'index',
        data.configurationParameters?.RobotsNoFollow === 'true' ? 'nofollow' : 'follow',
      ].join(', ');

      let title: string;
      let description: string;
      if (data.configurationParameters?.MetaInfo) {
        (data.configurationParameters?.MetaInfo as string).split(';').forEach(entry => {
          const keyValue = entry.split('=');
          if (keyValue[0] === 'metaTitle') {
            title = keyValue[1];
          } else if (keyValue[0] === 'metaDescription') {
            description = keyValue[1];
          }
        });
      }

      return { title, description, robots };
    }
  }
}
