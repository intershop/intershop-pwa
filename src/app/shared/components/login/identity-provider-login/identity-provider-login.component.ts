import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';
import { Auth0SignInComponent } from 'ish-shared/components/login/auth0-sign-in/auth0-sign-in.component';
import { LoginFormComponent } from 'ish-shared/components/login/login-form/login-form.component';

@Component({
  selector: 'ish-identity-provider-login',
  templateUrl: './identity-provider-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdentityProviderLoginComponent implements OnInit {
  @Input() labelClass: string;
  @Input() inputClass: string;
  @Input() forgotPasswordClass: string;
  @Input() signInClass: string;

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  constructor(private identityProviderFactory: IdentityProviderFactory) {}

  ngOnInit() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let componentRef: ComponentRef<any>;

    switch (this.identityProviderFactory.getType()) {
      case 'auth0':
        componentRef = this.anchor.createComponent(Auth0SignInComponent);
        break;

      default:
        componentRef = this.anchor.createComponent(LoginFormComponent);
        break;
    }

    componentRef.instance.labelClass = this.labelClass;
    componentRef.instance.inputClass = this.inputClass;
    componentRef.instance.forgotPasswordClass = this.forgotPasswordClass;
    componentRef.instance.signInClass = this.signInClass;

    componentRef.changeDetectorRef.markForCheck();
  }
}
