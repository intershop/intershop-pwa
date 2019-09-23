import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { FormsSharedModule } from 'ish-shared/forms/forms.module';

import { ForgotPasswordFormComponent } from './forgot-password-form.component';

describe('Forgot Password Form Component', () => {
  let component: ForgotPasswordFormComponent;
  let fixture: ComponentFixture<ForgotPasswordFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordFormComponent],
      imports: [
        FeatureToggleModule,
        FormsSharedModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({ reducers: coreReducers }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render forgot password form for password reminder', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=email]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=firstName]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=lastName]')).toBeTruthy();
    expect(element.querySelector('[name="passwordReminder"]')).toBeTruthy();
  });

  describe('email format', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should not detect error if email is well formed', () => {
      component.form.controls.email.setValue('test@test.com');
      expect(component.form.controls.email.valid).toBeTruthy();
    });

    it('should detect error if email is malformed', () => {
      component.form.controls.email.setValue('testtest.com');
      expect(component.form.controls.email.valid).toBeFalsy();
    });
  });
});
