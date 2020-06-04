import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCurrentLocale, getICMStaticURL } from 'ish-core/store/core/configuration';
import { mapToProperty } from 'ish-core/utils/operators';

import { ContentConfigurationParameterData } from './content-configuration-parameter.interface';

export interface ContentConfigurationParameters {
  [key: string]: string | object | number;
}

@Injectable({ providedIn: 'root' })
export class ContentConfigurationParameterMapper {
  private staticURL: string;
  private lang = '-';

  constructor(store: Store) {
    store.pipe(select(getICMStaticURL)).subscribe(url => (this.staticURL = url));
    store.pipe(select(getCurrentLocale), mapToProperty('lang')).subscribe(lang => (this.lang = lang || '-'));
  }

  fromData(data: { [name: string]: ContentConfigurationParameterData }): ContentConfigurationParameters {
    let configurationParameters = {};

    if (data) {
      configurationParameters = Object.entries(data)
        .map(([key, value]) => ({ [key]: value.value }))
        .reduce((acc, val) => ({ ...acc, ...val }));
    }

    this.postProcessFileReferences(configurationParameters);

    return configurationParameters;
  }

  /**
   * TODO: make this dependant on the type of the configuration parameter once the CMS REST API provides this information
   * for now filter all configuration parameters that start with 'Image' or 'Video'
   * and where the value does not start with 'http' but contains ':/'
   + if the filter matches convert the CMS REST API value in a full server URL to the configured file
   */
  postProcessFileReferences(data: ContentConfigurationParameters): ContentConfigurationParameters {
    Object.keys(data)
      .filter(
        key =>
          (key.startsWith('Image') || key.startsWith('Video')) &&
          data[key] &&
          !data[key].toString().startsWith('http') &&
          data[key].toString().includes(':/')
      )
      .forEach(key => {
        const split = data[key].toString().split(':');
        data[key] = encodeURI(`${this.staticURL}/${split[0]}/${this.lang}${split[1]}`);
      });
    return data;
  }
}
