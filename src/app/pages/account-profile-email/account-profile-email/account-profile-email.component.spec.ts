import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { User } from 'ish-core/models/user/user.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { AccountProfileEmailComponent } from './account-profile-email.component';

describe('Account Profile Email Component', () => {
  let component: AccountProfileEmailComponent;
  let fixture: ComponentFixture<AccountProfileEmailComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [AccountProfileEmailComponent, MockComponent(ErrorMessageComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileEmailComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.currentUser = { email: 'patricia@test.intershop.de' } as User;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display 3 input fields for email, emailConfirmation and password', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('formly-field')).toHaveLength(3);
  });

  it('should emit updateEmail event if form is valid', () => {
    const eventEmitter$ = spy(component.updateEmail);
    fixture.detectChanges();

    component.form.get('email').setValue('patricia@test.intershop.de');
    component.form.get('emailConfirmation').setValue('patricia@test.intershop.de');
    component.form.get('currentPassword').setValue('!InterShop00!');
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
