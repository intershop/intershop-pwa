import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getICMStaticURL } from 'ish-core/store/configuration';
import { getCurrentLocale } from 'ish-core/store/locale';
import { mapToProperty } from 'ish-core/utils/operators';

import { ContentConfigurationParameterData } from './content-configuration-parameter.interface';

export declare interface ContentConfigurationParameters {
  [key: string]: string | object;
}

@Injectable({ providedIn: 'root' })
export class ContentConfigurationParameterMapper {
  private staticURL: string;
  private lang = '-';

  constructor(store: Store<{}>) {
    store.pipe(select(getICMStaticURL)).subscribe(url => (this.staticURL = url));
    store
      .pipe(
        select(getCurrentLocale),
        mapToProperty('lang')
      )
      .subscribe(lang => (this.lang = lang || '-'));
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
        data[key] = `${this.staticURL}/${split[0]}/${this.lang}${split[1]}`;
      });
    return data;
  }
}
