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

  it('should display 2 input fields for login and password', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('formly-group formly-group formly-field')).toHaveLength(2);
  });

  it('should emit updateUserName event if form is valid', () => {
    const eventEmitter$ = spy(component.updateUserName);
    fixture.detectChanges();

    const form = component.accountProfileUsernameForm as UntypedFormGroup;

    form.get('login').setValue('newusername');
    form.get('currentPassword').setValue('!InterShop00!');
    component.submit();

    verify(eventEmitter$.emit(anything())).once();
  });

  it('should not emit updateUserName event if form is invalid', () => {
    const eventEmitter$ = spy(component.updateUserName);
    fixture.detectChanges();

    component.submit();

    verify(eventEmitter$.emit(anything())).never();
  });
});
