import { LocationStrategy } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'makeHref', pure: false })
export class MakeHrefPipe implements PipeTransform {
  transform(location: LocationStrategy, urlParams: { [key: string]: string }): string {
    if (!location || !location.path()) {
      return 'undefined';
    }

    const split = location.path().split('?');

    // url without query params
    let newUrl = split[0];

    // add supplied url params
    if (urlParams) {
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
