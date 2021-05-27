import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { RegistrationFormConfigurationService } from 'ish-core/services/registration-form-configuration/registration-form-configuration.service';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { RegistrationPageComponent } from './registration-page.component';

// tslint:disable:no-intelligence-in-artifacts
describe('Registration Page Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let configService: RegistrationFormConfigurationService;
  let featureToggleService: FeatureToggleService;
  let activatedRoute: ActivatedRoute;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    configService = mock(RegistrationFormConfigurationService);
    featureToggleService = mock(FeatureToggleService);
    activatedRoute = mock(ActivatedRoute);
    await TestBed.configureTestingModule({
      declarations: [MockComponent(ErrorMessageComponent), MockComponent(LoadingComponent), RegistrationPageComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useFactory: () => instance(activatedRoute) },
        { provide: RegistrationFormConfigurationService, useFactory: () => instance(configService) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
      ],
    }).compileComponents();

    when(featureToggleService.enabled(anyString())).thenReturn(false);
    when(configService.getFields(anything())).thenReturn([
      {
        key: 'test',
        type: 'ish-text-input-field',
      },
    ]);
    when(activatedRoute.snapshot).thenReturn({
      queryParams: {},
      url: [{ path: '/register' } as UrlSegment, { path: 'sso' } as UrlSegment],
    } as ActivatedRouteSnapshot);

    when(configService.getErrorSources()).thenReturn(of());
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

  it('should display form with registration configuration', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('formly-field')).toMatchInlineSnapshot(`
      NodeList [
        <formly-field hide-deprecation=""
        ><ng-component
          >TextInputFieldComponent: test ish-text-input-field { "label": "", "placeholder": "", "focus":
          false, "disabled": false}</ng-component
        ></formly-field
      >,
      ]
    `);
  });

  it('should navigate to homepage when cancel is clicked', fakeAsync(() => {
    fixture.detectChanges();
    component.cancelForm();

    tick(500);

    verify(configService.cancelRegistrationForm(anything())).once();
  }));
});
