import { LinkParser } from 'ish-core/utils/link-parser';

import { ContentConfigurationParameterView } from './content-view.model';

export class ContentViewHelper {
  /**
   * get a routerLink for a given configuration parameter of the given configuration parameter container
   * the configuration parameter value may contain an ICM short link notation or an external URL
   * the default route is '/home'
   * @param configParamCtnr
   * @param configParam
   */
  static getRouterLink(configParamCtnr: ContentConfigurationParameterView, configParam: string): string {
    const configParamValue = configParamCtnr.stringParam(configParam);
    return LinkParser.parseLink(configParamValue) || '/home';
  }

  /**
   * determine whether the a given configuration parameter of the given configuration parameter container
   * contains a link value that is supposed to be handled as a routerLink or not (external link)
   * @param configParamCtnr
   * @param configParam
   */
  static isRouterLink(configParamCtnr: ContentConfigurationParameterView, configParam: string): boolean {
    const configParamValue = configParamCtnr.stringParam(configParam);
    return configParamValue && !configParamValue.startsWith('http');
  }
}
