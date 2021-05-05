import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { PunchoutType } from '../../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-account-punchout-header',
  templateUrl: './account-punchout-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPunchoutHeaderComponent {
  @Input() punchoutTypes: PunchoutType[];
  @Input() selectedType: PunchoutType;
  @Input() error: HttpError;
}
