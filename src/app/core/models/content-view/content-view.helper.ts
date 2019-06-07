import { LinkParser } from 'ish-core/utils/link-parser';

import { ContentConfigurationParameterView } from './content-views';

export class ContentViewHelper {
  /**
   * get RouterLink for ish-cms-pagelet by configParam
   * defaultRouterLink is '/home'
   * @param pagelet
   * @param configParam
   */
  static getRouterLink(pagelet: ContentConfigurationParameterView, configParam: string): string {
    const configParamValue = pagelet.stringParam(configParam);
    return LinkParser.parseLink(configParamValue) || '/home';
  }
}
