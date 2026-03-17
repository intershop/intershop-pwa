import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { PaymentPaypalComponent } from 'ish-shared/components/payment/payment-paypal/payment-paypal.component';

@Component({
  selector: 'ish-home-page',
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ContentIncludeComponent, TranslatePipe, ServerSettingPipe, PaymentPaypalComponent],
})
export class HomePageComponent {}
