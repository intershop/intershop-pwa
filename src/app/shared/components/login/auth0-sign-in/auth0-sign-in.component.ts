import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-auth0-sign-in',
  templateUrl: './auth0-sign-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Auth0SignInComponent {
  @Input() signInClass: string;

  constructor(private location: Location) {}

  get returnUrl() {
    return this.location.path();
  }
}
