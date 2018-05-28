import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-account-root',
  templateUrl: './account-root.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountRootComponent {}
