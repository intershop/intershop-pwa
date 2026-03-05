import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { CMSModule } from 'ish-shared/cms/cms.module';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { PaymentPaypalMessagesComponent } from 'ish-shared/components/checkout/payment-paypal-messages/payment-paypal-messages.component';

@Component({
  selector: 'ish-home-page',
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentIncludeComponent,
    TranslatePipe,
    CMSModule,
    NgIf,
    ServerSettingPipe,
    PaymentPaypalMessagesComponent,
  ],
})
export class HomePageComponent {}
