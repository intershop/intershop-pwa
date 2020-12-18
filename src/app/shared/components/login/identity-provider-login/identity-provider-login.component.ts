import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';
import { Auth0SigninComponent } from 'ish-shared/components/login/auth0-signin/auth0-signin.component';
import { LoginFormComponent } from 'ish-shared/components/login/login-form/login-form.component';

@Component({
  selector: 'ish-identity-provider-login',
  templateUrl: './identity-provider-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-creation-test
export class IdentityProviderLoginComponent implements OnInit {
  @Input() labelClass: string;
  @Input() inputClass: string;
  @Input() forgotPasswordClass: string;
  @Input() signInClass: string;

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private identityProviderFactory: IdentityProviderFactory
  ) {}

  ngOnInit() {
    // tslint:disable-next-line: no-any
    let componentRef: ComponentRef<any>;

    switch (this.identityProviderFactory.getType()) {
      case 'auth0':
        componentRef = this.anchor.createComponent(
          this.componentFactoryResolver.resolveComponentFactory(Auth0SigninComponent)
        );
        break;

      default:
        componentRef = this.anchor.createComponent(
          this.componentFactoryResolver.resolveComponentFactory(LoginFormComponent)
        );
        break;
    }

    componentRef.instance.labelClass = this.labelClass;
    componentRef.instance.inputClass = this.inputClass;
    componentRef.instance.forgotPasswordClass = this.forgotPasswordClass;
    componentRef.instance.signInClass = this.signInClass;

    componentRef.changeDetectorRef.markForCheck();
  }
}
