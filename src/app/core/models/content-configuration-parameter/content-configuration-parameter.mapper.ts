import { Inject, Injectable } from '@angular/core';

import { STATIC_URL } from 'ish-core/utils/state-transfer/factories';

import { ContentConfigurationParameterData } from './content-configuration-parameter.interface';

export declare interface ContentConfigurationParameters {
  [key: string]: string | object;
}

@Injectable({ providedIn: 'root' })
export class ContentConfigurationParameterMapper {
  constructor(@Inject(STATIC_URL) private staticURL: string) {}

  fromData(data: { [name: string]: ContentConfigurationParameterData }): ContentConfigurationParameters {
    return !data
      ? {}
      : Object.entries(data)
          .map(([key, value]) => ({ [key]: value.value }))
          .reduce((acc, val) => ({ ...acc, ...val }));
  }

  postProcessImageURLs(data: ContentConfigurationParameters): ContentConfigurationParameters {
    Object.keys(data)
      .filter(key => key.startsWith('Image') && data[key] && data[key].toString().includes(':'))
      .forEach(key => {
        const split = data[key].toString().split(':');
        data[key] = `${this.staticURL}/${split[0]}/-${split[1]}`;
      });
    return data;
  }
}
