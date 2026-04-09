import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoMessageComponent } from 'ish-shared/components/common/info-message/info-message.component';

import { PunchoutType } from '../../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-account-punchout-header',
  templateUrl: './account-punchout-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ErrorMessageComponent, InfoMessageComponent, NgbNavModule, RouterLink, TranslatePipe],
})
export class AccountPunchoutHeaderComponent {
  @Input({ required: true }) selectedType: PunchoutType;
  @Input() punchoutTypes: PunchoutType[];
  @Input() error: HttpError;
}
