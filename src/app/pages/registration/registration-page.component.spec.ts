import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FormlyConfig, FormlyForm } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { RegistrationPageComponent } from './registration-page.component';

describe('Registration Page Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let location: Location;
  let formlyConfig: FormlyConfig;
  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(async () => {
    formlyConfig = mock(FormlyConfig);
    await TestBed.configureTestingModule({
      declarations: [
        DummyComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(FormlyForm),
        RegistrationPageComponent,
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: 'home', component: DummyComponent }]),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: FormlyConfig, useFactory: () => instance(formlyConfig) },
        { provide: FeatureToggleService, useFactory: () => instance(mock(FeatureToggleService)) },
      ],
    }).compileComponents();

    location = TestBed.inject(Location);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(formlyConfig.getType(anything())).thenReturn({ name: '', wrappers: [] });
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
