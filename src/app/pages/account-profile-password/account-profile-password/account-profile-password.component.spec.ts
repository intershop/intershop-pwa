import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormlyForm } from '@ngx-formly/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { AccountProfilePasswordComponent } from './account-profile-password.component';

describe('Account Profile Password Component', () => {
  let component: AccountProfilePasswordComponent;
  let fixture: ComponentFixture<AccountProfilePasswordComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountProfilePasswordComponent, FormlyTestingModule, TranslateModule.forRoot()],
    })
      .overrideComponent(AccountProfilePasswordComponent, {
        set: {
          imports: [
            MockComponent(ErrorMessageComponent),
            FormSubmitDirective,
            FormlyForm,
            ReactiveFormsModule,
            TranslatePipe,
            MockDirective(RouterLink),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfilePasswordComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display 3 input fields for oldPassword, password and passwordConfirmation', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('formly-group formly-group formly-field')).toHaveLength(3);
  });

  it('should emit updatePassword event if form is valid', () => {
    const eventEmitter$ = spy(component.updatePassword);
    fixture.detectChanges();

    const form = component.accountProfilePasswordForm as UntypedFormGroup;

    form.get('currentPassword').setValue('!Password01!');
    form.get('password').setValue('!Password01!');
    form.get('passwordConfirmation').setValue('!Password01!');
    component.submit();

    verify(eventEmitter$.emit(anything())).once();
  });

  it('should not emit updatePassword event if form is invalid', () => {
    const eventEmitter$ = spy(component.updatePassword);
    fixture.detectChanges();

    component.submit();

    verify(eventEmitter$.emit(anything())).never();
  });
});
