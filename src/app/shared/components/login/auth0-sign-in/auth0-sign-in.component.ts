import { Location, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ish-auth0-sign-in',
  templateUrl: './auth0-sign-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, RouterModule],
})
export class Auth0SignInComponent {
  @Input() signInClass: string;

  constructor(private location: Location) {}

  get returnUrl() {
    return this.location.path();
  }
}
