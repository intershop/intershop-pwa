import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-azure-ad-sign-in',
  templateUrl: './azure-ad-sign-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AzureADSignInComponent {
  @Input() signInClass: string;

  constructor(private location: Location) {}

  get returnUrl() {
    return this.location.path();
  }
}
