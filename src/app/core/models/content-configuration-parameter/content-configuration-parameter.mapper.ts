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

  // post process the configuration parameter data to apply special handling for specific types
  private postProcessData(data: ContentConfigurationParameterData): string | object | number {
    switch (data.type) {
      case 'bc_pmc:types.pagelet2-ImageFileRef':
      case 'bc_pmc:types.pagelet2-FileRef':
        if (Array.isArray(data.value)) {
          return data.value.map(x => this.processFileReferences(x));
        } else {
          return this.processFileReferences(data.value.toString());
        }
      default:
        // parse values of configuration parameters that end in 'JSON' to JSON objects
        if (data.definitionQualifiedName.endsWith('JSON')) {
          return JSON.parse(data.value as string);
        }
        return data.value;
    }
  }

  // process file reference values according to their type
  private processFileReferences(value: string): string {
    // absolute URL references - keep them as they are (http:// and https://)
    if (value.startsWith('http')) {
      return value;
    }

    // relative URL references, e.g. to asset files are prefixed with 'file://'
    if (value.startsWith('file://')) {
      return value.split('file://')[1];
    }

    // everything else that does not include ':/' is not an ICM file reference and is left as it is
    if (!value.includes(':/')) {
      return value;
    }

    // convert ICM file references to full server URLs
    const split = value.split(':');
    return encodeURI(`${this.staticURL}/${split[0]}/${this.lang}${split[1]}`);
  }
}
