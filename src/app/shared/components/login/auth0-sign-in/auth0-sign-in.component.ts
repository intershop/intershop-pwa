import { Location, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ish-auth0-sign-in',
  imports: [NgClass, RouterLink],
  standalone: true,
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
