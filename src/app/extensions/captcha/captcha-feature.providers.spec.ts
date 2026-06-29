import { TestBed } from '@angular/core/testing';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha-2';
import { of } from 'rxjs';

import { provideCaptchaFeature } from './captcha-feature.providers';
import { CaptchaFacade } from './facades/captcha.facade';

describe('Captcha Feature Providers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...provideCaptchaFeature(),
        {
          provide: CaptchaFacade,
          useValue: {
            captchaSiteKey$: of('captcha-site-key'),
          },
        },
      ],
    });
  });

  it('should provide the recaptcha v3 site key', () => {
    expect(TestBed.inject(RECAPTCHA_V3_SITE_KEY)).toBe('captcha-site-key');
  });
});
