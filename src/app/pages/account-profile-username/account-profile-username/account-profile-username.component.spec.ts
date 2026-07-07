import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { User } from 'ish-core/models/user/user.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { AccountProfileUsernameComponent } from './account-profile-username.component';

describe('Account Profile Username Component', () => {
  let component: AccountProfileUsernameComponent;
  let fixture: ComponentFixture<AccountProfileUsernameComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslatePipe],
      declarations: [AccountProfileUsernameComponent, MockComponent(ErrorMessageComponent)],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileUsernameComponent);
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

    expect(element.querySelectorAll('formly-group formly-group formly-field')).toHaveLength(3);
  });

  it('should emit updateEmail event if form is valid', () => {
    const eventEmitter$ = spy(component.updateEmail);
    fixture.detectChanges();

    const form = component.form as UntypedFormGroup;

    form.get('email').setValue('patricia@test.intershop.de');
    form.get('emailConfirmation').setValue('patricia@test.intershop.de');
    form.get('currentPassword').setValue('!InterShop00!');
    component.submit();

    verify(eventEmitter$.emit(anything())).once();
  });

  it('should not emit updateEmail event if form is invalid', () => {
    const eventEmitter$ = spy(component.updateEmail);
    fixture.detectChanges();

    component.submit();

    verify(eventEmitter$.emit(anything())).never();
  });
});
