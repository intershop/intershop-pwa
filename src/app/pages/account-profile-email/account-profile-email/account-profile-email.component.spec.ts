import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { AccountProfileEmailComponent } from './account-profile-email.component';

describe('Account Profile Email Component', () => {
  let component: AccountProfileEmailComponent;
  let fixture: ComponentFixture<AccountProfileEmailComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [AccountProfileEmailComponent, MockComponent(ErrorMessageComponent), MockComponent(InputComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileEmailComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display 3 input fields for email, emailConfirmation and password', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('ish-input')).toHaveLength(3);
  });

  it('should emit updateEmail event if form is valid', () => {
    const eventEmitter$ = spy(component.updateEmail);
    fixture.detectChanges();

    component.form.get('email').setValue('patricia@test.intershop.de');
    component.form.get('emailConfirmation').setValue('patricia@test.intershop.de');
    component.form.get('password').setValue('intershop');
    component.submit();

    verify(eventEmitter$.emit(anything())).once();
  });

  it('should not emit updateEmail event if form is invalid', () => {
    const eventEmitter$ = spy(component.updateEmail);
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
