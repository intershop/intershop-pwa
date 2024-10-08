import { LocationStrategy } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { omit } from 'ish-core/utils/functions';
import { MultiSiteService } from 'ish-core/utils/multi-site/multi-site.service';

@Pipe({ name: 'ishMakeHref', pure: false })
export class MakeHrefPipe implements PipeTransform {
  constructor(private multiSiteService: MultiSiteService) {}
  transform(location: LocationStrategy, urlParams: Record<string, string>): Observable<string> {
    if (!location?.path()) {
      return of('undefined');
    }

    return of(location.path().split('?')).pipe(
      switchMap(split => {
        // url without query params
        const newUrl = split[0];

        if (urlParams) {
          if (urlParams.lang) {
            return this.multiSiteService.getLangUpdatedUrl(urlParams.lang, newUrl).pipe(
              map(modifiedUrl => {
                const modifiedUrlParams = modifiedUrl === newUrl ? urlParams : omit(urlParams, 'lang');
                return this.multiSiteService.appendUrlParams(modifiedUrl, modifiedUrlParams, split?.[1]);
              })
            );
          } else {
            return of(newUrl).pipe(map(url => this.multiSiteService.appendUrlParams(url, urlParams, split?.[1])));
          }
        } else {
          return of(this.multiSiteService.appendUrlParams(newUrl, undefined, split?.[1]));
        }
      })
    );
  }
}
