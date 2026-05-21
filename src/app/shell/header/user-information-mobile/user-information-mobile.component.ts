import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-user-information-mobile',
  standalone: false,
  templateUrl: './user-information-mobile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInformationMobileComponent {}
