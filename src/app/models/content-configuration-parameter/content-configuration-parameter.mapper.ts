import { ContentConfigurationParameterData } from './content-configuration-parameter.interface';

export declare interface ContentConfigurationParameters {
  [key: string]: string | object;
}

export class ContentConfigurationParameterMapper {
  static fromData(data: { [name: string]: ContentConfigurationParameterData }): ContentConfigurationParameters {
    return !data
      ? {}
      : Object.entries(data)
          .map(([key, value]) => ({ [key]: value.value }))
          .reduce((acc, val) => ({ ...acc, ...val }));
  }
}
