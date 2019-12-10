import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookiesOptions, CookiesService as ForeignCookiesService } from '@ngx-utils/cookies';
import { ReplaySubject, timer } from 'rxjs';
import { distinct, map, switchMap, take } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

@Injectable({ providedIn: 'root' })
export class CookiesService {
  cookieLawSeen$ = new ReplaySubject<boolean>(1);

  constructor(
    private cookiesService: ForeignCookiesService,
    @Inject(PLATFORM_ID) private platformId: string,
    appRef: ApplicationRef
  ) {
    if (isPlatformBrowser(this.platformId)) {
      appRef.isStable
        .pipe(
          whenTruthy(),
          take(1),
          switchMap(() =>
            timer(0, 1000).pipe(
              map(() => this.cookiesService.get('cookieLawSeen') === 'true'),
              distinct()
            )
          )
        )
        .subscribe(this.cookieLawSeen$);
    } else {
      this.cookieLawSeen$.next(false);
    }
  }

  get(key: string): string {
    return isPlatformBrowser(this.platformId) ? this.cookiesService.get(key) : undefined;
  }

  remove(key: string) {
    this.cookiesService.remove(key);
  }

  put(key: string, value: string, options?: CookiesOptions) {
    this.cookiesService.put(key, value, options);
  }
}
