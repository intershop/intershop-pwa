import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, capture, instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { RegistrationConfigurationService } from './registration-configuration/registration-configuration.service';
import { RegistrationPageComponent } from './registration-page.component';

describe('Registration Page Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let location: Location;
  let configService: RegistrationConfigurationService;
  let featureToggleService: FeatureToggleService;
  let activatedRoute: ActivatedRoute;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(async () => {
    configService = mock(RegistrationConfigurationService);
    featureToggleService = mock(FeatureToggleService);
    activatedRoute = mock(ActivatedRoute);
    await TestBed.configureTestingModule({
      declarations: [DummyComponent, MockComponent(ErrorMessageComponent), RegistrationPageComponent],
      imports: [
        FormlyTestingModule,
        RouterTestingModule.withRoutes([{ path: 'home', component: DummyComponent }]),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: FeatureToggleService, useFactory: () => instance(featureToggleService) },
        { provide: ActivatedRoute, useFactory: () => instance(activatedRoute) },
      ],
    }).compileComponents();
    TestBed.overrideComponent(RegistrationPageComponent, {
      set: { providers: [{ provide: RegistrationConfigurationService, useFactory: () => instance(configService) }] },
    });

    location = TestBed.inject(Location);
    when(featureToggleService.enabled(anyString())).thenReturn(false);
    when(configService.getRegistrationConfiguration()).thenReturn([
      {
        key: 'test',
        type: 'ish-text-input-field',
      },
    ]);
    when(activatedRoute.queryParamMap).thenReturn(of(convertToParamMap({ sso: false })));
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

  it('should set configuration parameters on init', () => {
    fixture.detectChanges();
    const [args] = capture(configService.setConfiguration).last();
    expect(args).toMatchInlineSnapshot(`
      Object {
        "businessCustomer": false,
        "sso": false,
      }
    `);
  });

  it('should set configuration parameters depending on router', () => {
    when(activatedRoute.queryParamMap).thenReturn(of(convertToParamMap({ sso: true })));
    when(featureToggleService.enabled(anyString())).thenReturn(true);
    fixture.detectChanges();

    const [args] = capture(configService.setConfiguration).last();
    expect(args).toMatchInlineSnapshot(`
      Object {
        "businessCustomer": true,
        "sso": false,
      }
    `);
  });

  it('should display form with registration configuration', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('formly-field')).toMatchInlineSnapshot(`
      NodeList [
        <formly-field hide-deprecation=""
        ><ng-component
          >TextInputFieldComponent: { "label": "", "placeholder": "", "focus": false, "disabled":
          false}</ng-component
        ></formly-field
      >,
      ]
    `);
  });

  it('should navigate to homepage when cancel is clicked', fakeAsync(() => {
    fixture.detectChanges();
    component.cancelForm();

    tick(500);

    expect(location.path()).toEqual('/home');
  }));
});
