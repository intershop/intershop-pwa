import { isPlatformBrowser } from '@angular/common';
import * as crosstablib from 'crosstab';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export abstract class GlobalStateAwareService<T> {

  private subject$: BehaviorSubject<T>;

  constructor(
    private platformId,
    private name: string,
    private crosstab: boolean,
    private persistInSessionCookie: boolean,
    defaultValue: T = null, private cookieService?: CookieService
  ) {
    if (isPlatformBrowser(platformId) && this.crosstab) {
      crosstablib.on(this.name, (message) => {
        // console.log(crosstab.id + ' received ' + message.data + ' from ' + message.origin);
        if (message.origin !== crosstablib.id) {
          this.subject$.next(message.data);
        }
      });
    }

    if (isPlatformBrowser(platformId) && persistInSessionCookie) {
      const savedItem = this.cookieService.get(this.name);
      try {
        this.subject$ = new BehaviorSubject(JSON.parse(savedItem));
      } catch (err) {
        //
      }
    }
    if (!this.subject$) {
      this.subject$ = new BehaviorSubject(defaultValue);
    }
  }

  getValue(): T {
    return this.subject$.value;
  }

  subscribe(callback: (data: T) => void) {
    this.subject$.subscribe(callback);
  }

  protected next(data: T) {
    // console.error('data of ' + this._name + ' is now ' + data);
    this.subject$.next(data);

    if (isPlatformBrowser(this.platformId) && this.persistInSessionCookie) {
      this.cookieService.put(this.name, JSON.stringify(data));
    }

    if (isPlatformBrowser(this.platformId) && this.crosstab) {
      try {
        crosstablib.broadcast(this.name, data);
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}
