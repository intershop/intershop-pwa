import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { AccountProfilePasswordComponent } from './account-profile-password.component';

describe('Account Profile Password Component', () => {
  let component: AccountProfilePasswordComponent;
  let fixture: ComponentFixture<AccountProfilePasswordComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountProfilePasswordComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(InputComponent),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

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
    expect(element.querySelectorAll('ish-input')).toHaveLength(3);
  });

  it('should emit updatePassword event if form is valid', () => {
    const eventEmitter$ = spy(component.updatePassword);
    fixture.detectChanges();

    component.form.get('currentPassword').setValue('!Password01!');
    component.form.get('password').setValue('!Password01!');
    component.form.get('passwordConfirmation').setValue('!Password01!');
    component.submit();

    verify(eventEmitter$.emit(anything())).once();
  });

  it('should not emit updatePassword event if form is invalid', () => {
    const eventEmitter$ = spy(component.updatePassword);
    fixture.detectChanges();

    component.submit();

    verify(eventEmitter$.emit(anything())).never();
  });

  it('should disable submit button when the user submits an invalid form', () => {
    fixture.detectChanges();

    expect(component.buttonDisabled).toBeFalse();
    component.submit();
    expect(component.buttonDisabled).toBeTrue();
  });
});
