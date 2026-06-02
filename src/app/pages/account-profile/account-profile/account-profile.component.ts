import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { IdentityProviderCapabilityDirective } from 'ish-core/directives/identity-provider-capability.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { User } from 'ish-core/models/user/user.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';

@Component({
  selector: 'ish-account-profile',
  templateUrl: './account-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IdentityProviderCapabilityDirective, RouterLink, ServerHtmlDirective, ServerSettingPipe, TranslatePipe],
})
export class AccountProfileComponent {
  @Input({ required: true }) user: User;

  @Input() subscribedToNewsletter: boolean;
}
