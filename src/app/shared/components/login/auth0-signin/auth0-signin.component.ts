import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-auth0-signin',
  templateUrl: './auth0-signin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Auth0SigninComponent {
  @Input() signInClass: string;

  constructor(private location: Location) {}

  get returnUrl() {
    return this.location.path();
  }
}
