import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { CaptchaV3TokenProvider } from 'ish-core/models/captcha/captcha-token-provider.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { CaptchaFacade } from '../facades/captcha.facade';

declare const grecaptcha: {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

@Injectable({ providedIn: 'root' })
export class CaptchaV3TokenService implements CaptchaV3TokenProvider {
  private scriptLoaded = false;

  constructor(private captchaFacade: CaptchaFacade) {}

  execute(action: string): Observable<string> {
    return this.captchaFacade.captchaSiteKey$.pipe(
      whenTruthy(),
      take(1),
      switchMap(siteKey => this.ensureScriptLoaded(siteKey)),
      switchMap(
        siteKey =>
          new Observable<string>(subscriber => {
            grecaptcha.ready(() => {
              grecaptcha
                .execute(siteKey, { action })
                .then(token => {
                  subscriber.next(token);
                  subscriber.complete();
                })
                .catch(err => subscriber.error(err));
            });
          })
      )
    );
  }

  private ensureScriptLoaded(siteKey: string): Observable<string> {
    if (this.scriptLoaded || typeof grecaptcha !== 'undefined') {
      this.scriptLoaded = true;
      return of(siteKey);
    }

    return new Observable<string>(subscriber => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
      script.onload = () => {
        this.scriptLoaded = true;
        subscriber.next(siteKey);
        subscriber.complete();
      };
      script.onerror = err => subscriber.error(err);
      document.head.appendChild(script);
    });
  }
}
