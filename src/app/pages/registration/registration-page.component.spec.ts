import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyAddressFormComponent } from 'ish-shared/formly-address-forms/components/formly-address-form/formly-address-form.component';
import { ValidationMessageComponent } from 'ish-shared/formly/components/validation-message/validation-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { RegistrationAddressFieldComponent } from './formly/registration-address-field/registration-address-field.component';
import { RegistrationHeadingFieldComponent } from './formly/registration-heading-field/registration-heading-field.component';
import { RegistrationTacFieldComponent } from './formly/registration-tac-field/registration-tac-field.component';
import { RegistrationConfigurationService } from './registration-configuration/registration-configuration.service';
import { RegistrationPageComponent } from './registration-page.component';

const registrationFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-registration-address-field',
      component: RegistrationAddressFieldComponent,
    },
    { name: 'ish-registration-heading-field', component: RegistrationHeadingFieldComponent },
    { name: 'ish-registration-tac-field', component: RegistrationTacFieldComponent },
  ],
};

describe('Registration Page Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let location: Location;
  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DummyComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(FormlyAddressFormComponent),
        MockComponent(ValidationMessageComponent),
        MockDirective(ServerHtmlDirective),
        RegistrationAddressFieldComponent,
        RegistrationHeadingFieldComponent,
        RegistrationPageComponent,
        RegistrationTacFieldComponent,
      ],
      imports: [
        FormlyModule.forChild(registrationFormlyConfig),
        FormlyTestingModule,
        RouterTestingModule.withRoutes([{ path: 'home', component: DummyComponent }]),
        TranslateModule.forRoot(),
      ],
      providers: [
        RegistrationConfigurationService,
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: FeatureToggleService, useFactory: () => instance(mock(FeatureToggleService)) },
      ],
    }).compileComponents();

    location = TestBed.inject(Location);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should navigate to homepage when cancel is clicked', fakeAsync(() => {
    fixture.detectChanges();
    component.cancelForm();

    tick(500);

    expect(location.path()).toEqual('/home');
  }));
});
