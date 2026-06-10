// eslint-disable-next-line max-classes-per-file
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DirectivesModule } from 'ish-core/directives.module';

/**
 * The Captcha V3 Component
 *
 * Displays the reCAPTCHA V3 info text. Token handling is done in the ApiService.
 * It should only be used by {@link CaptchaComponent}
 */
@Component({
  selector: 'ish-captcha-v3',
  templateUrl: './captcha-v3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaV3Component {}

@NgModule({
  imports: [DirectivesModule, TranslateModule],
  declarations: [CaptchaV3Component],
})
export class CaptchaV3ComponentModule {}
