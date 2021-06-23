import { LocationStrategy } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { MultiSiteService } from 'ish-core/utils/multi-site/multi-site.service';

@Pipe({ name: 'makeHref', pure: false })
export class MakeHrefPipe implements PipeTransform {
  constructor(private multiSiteService: MultiSiteService) {}
  transform(location: LocationStrategy, urlParams: Record<string, string>): string {
    if (!location || !location.path()) {
      return 'undefined';
    }

    const split = location.path().split('?');

    // url without query params
    let newUrl = split[0];

    // add supplied url params
    if (urlParams) {
      if (urlParams.lang) {
        newUrl = this.multiSiteService.getLangUpdatedUrl(urlParams.lang, location);
      }
      newUrl += Object.keys(urlParams)
        .map(k => `;${k}=${urlParams[k]}`)
        .join('');
    }

    // add query params at the end
    if (split.length > 1) {
      newUrl += `?${split[1]}`;
    }
    return newUrl;
  }
}
