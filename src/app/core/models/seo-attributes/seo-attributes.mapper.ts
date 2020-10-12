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
}
