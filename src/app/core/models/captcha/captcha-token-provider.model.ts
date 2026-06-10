import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface CaptchaV3TokenProvider {
  execute(action: string): Observable<string>;
}

export const CAPTCHA_V3_TOKEN_PROVIDER = new InjectionToken<CaptchaV3TokenProvider>('captchaV3TokenProvider');
