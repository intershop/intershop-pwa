import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DirectivesModule } from 'ish-core/directives.module';
import { IconModule } from 'ish-core/icon.module';
import { User } from 'ish-core/models/user/user.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';

@Component({
  selector: 'ish-account-profile',
  templateUrl: './account-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DirectivesModule, NgIf, RouterModule, TranslateModule, IconModule, ServerSettingPipe],
})
export class AccountProfileComponent {
  @Input({ required: true }) user: User;

  @Input() subscribedToNewsletter: boolean;
}
