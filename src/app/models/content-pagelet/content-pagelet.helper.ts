import { ContentPagelet } from './content-pagelet.model';

export class ContentPageletHelper {
  /**
   * Get the Configuration Parameter 'value' for a given Configuration Parameter 'name' of the given pagelet.
   * @param pagelet                     The Pagelet from wich to get the Configuration Parameter
   * @param configurationParameterName  The name of the Configuration Parameter of interest
   * @param valueType                   The wanted value type if other then 'string', e.g. 'boolean' or 'number'
   * @returns                           The Configuration Parameter value if not undefined
   */
  static getConfigurationParameterValue(
    pagelet: ContentPagelet,
    configurationParameterName: string,
    valueType?: string
  ): any {
    if (!(pagelet && pagelet.configurationParameters && pagelet.configurationParameters[configurationParameterName])) {
      return;
    }
    if (valueType) {
      switch (valueType) {
        case 'boolean':
          return (
            (pagelet.configurationParameters[configurationParameterName] as string).toLowerCase().trim() === 'true'
          );
        case 'number':
          return Number(pagelet.configurationParameters[configurationParameterName]);
        default:
          break;
      }
    }
    return pagelet.configurationParameters[configurationParameterName];
  }
}
