/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { FormlyForm } from '@ngx-formly/core';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { AddressDoctorComponent } from '../../extensions/address-doctor/shared/address-doctor/address-doctor.component';

import { RegistrationPageComponent } from './registration-page.component';
import { RegistrationFormConfigurationService } from './services/registration-form-configuration/registration-form-configuration.service';

describe('Registration Page Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let configService: RegistrationFormConfigurationService;
  let activatedRoute: ActivatedRoute;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    configService = mock(RegistrationFormConfigurationService);
    activatedRoute = mock(ActivatedRoute);
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, RegistrationPageComponent],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: ActivatedRoute, useFactory: () => instance(activatedRoute) },
        { provide: FeatureToggleService, useValue: { enabled: () => true } },
        { provide: RegistrationFormConfigurationService, useFactory: () => instance(configService) },
        provideTranslateService(),
      ],
    })
      .overrideComponent(RegistrationPageComponent, {
        set: {
          imports: [
            MockComponent(ErrorMessageComponent),
            AsyncPipe,
            TranslatePipe,
            MockComponent(AddressDoctorComponent),
            MockComponent(LoadingComponent),
            ReactiveFormsModule,
            FormlyForm,
          ],
        },
      })
      .compileComponents();

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
    when(accountFacade.userLoading$).thenReturn(of(false));
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
    expect(element.querySelectorAll('formly-group formly-field')).toMatchInlineSnapshot(`
      NodeList [
        <formly-field
        ><ish-input-test-field
          >TextInputFieldComponent: test ish-text-input-field { "label": "", "placeholder": "",
          "disabled": false}</ish-input-test-field
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
