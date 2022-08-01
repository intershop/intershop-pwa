import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCurrentLocale, getICMStaticURL } from 'ish-core/store/core/configuration';

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
    store.pipe(select(getCurrentLocale)).subscribe(lang => (this.lang = lang || '-'));
  }

  fromData(data: { [name: string]: ContentConfigurationParameterData }): ContentConfigurationParameters {
    let configurationParameters = {};

    if (data) {
      configurationParameters = Object.entries(data)
        .map(([key, value]) => ({ [key]: this.postProcessData(value) }))
        .reduce((acc, val) => ({ ...acc, ...val }));
    }

    return configurationParameters;
  }

  private resolveStaticURL(value: string): string {
    if (value.startsWith('http')) {
      return value;
    }

    if (!value.includes(':/')) {
      return value;
    }

    const split = value.split(':');

    return encodeURI(`${this.staticURL}/${split[0]}/${this.lang}${split[1]}`);
  }

  /**
   * TODO: Make this method use name-based plugin mechanism to delegate post processing of
   * configuration parameter data to specific handler.
   */
  private postProcessData(data: ContentConfigurationParameterData): string | object | number {
    switch (data.type) {
      case 'bc_pmc:types.pagelet2-ImageFileRef':
      case 'bc_pmc:types.pagelet2-FileRef':
        if (Array.isArray(data.value)) {
          return data.value.map(x => this.resolveStaticURL(x));
        } else {
          return this.resolveStaticURL(data.value.toString());
        }
      default:
        return data.value;
    }
  }
}
