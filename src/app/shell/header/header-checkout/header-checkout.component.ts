import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-header-checkout',
  standalone: false,
  templateUrl: './header-checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderCheckoutComponent {}
