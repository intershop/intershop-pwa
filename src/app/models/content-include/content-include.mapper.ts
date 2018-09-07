import { ContentIncludeData } from './content-include.interface';
import { ContentInclude } from './content-include.model';

export class ContentIncludeMapper {
  /**
   * Converts {@link ContentIncludeData} to the model entity {@link ContentInclude}.
   */
  static fromData(data: ContentIncludeData): ContentInclude {
    const contentInclude: ContentInclude = {
      id: data.link.title,
      displayName: data.displayName,
      pagelets: data.pagelets || [],
    };
    if (data.configurationParameters) {
      contentInclude.configurationParameters = data.configurationParameters;
    }
    return contentInclude;
  }
}
