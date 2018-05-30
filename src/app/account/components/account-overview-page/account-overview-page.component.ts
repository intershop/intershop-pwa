import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../models/user/user.model';

@Component({
  selector: 'ish-account-overview-page',
  templateUrl: './account-overview-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewPageComponent {
  @Input() user: User;
}
