import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getICMStaticURL } from 'ish-core/store/configuration';

import { ContentConfigurationParameterData } from './content-configuration-parameter.interface';

export declare interface ContentConfigurationParameters {
  [key: string]: string | object;
}

@Injectable({ providedIn: 'root' })
export class ContentConfigurationParameterMapper {
  private staticURL: string;

  constructor(store: Store<{}>) {
    store.pipe(select(getICMStaticURL)).subscribe(url => (this.staticURL = url));
  }

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
