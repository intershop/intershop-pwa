import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, spy, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { User } from 'ish-core/models/user/user.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';
import { FieldLibrary } from 'ish-shared/formly/field-library/field-library';

import { AccountProfileUserComponent } from './account-profile-user.component';

describe('Account Profile User Component', () => {
  let component: AccountProfileUserComponent;
  let fixture: ComponentFixture<AccountProfileUserComponent>;
  let element: HTMLElement;
  let fieldLibraryMock: FieldLibrary;

  let appFacadeMock: AppFacade;
  let accountFacadeMock: AccountFacade;

  let currentUser: User;
  let invalidUser: User;

  beforeEach(async () => {
    appFacadeMock = mock(AppFacade);
    accountFacadeMock = mock(AccountFacade);

    fieldLibraryMock = mock(FieldLibrary);
    when(fieldLibraryMock.getConfigurationGroup(anything())).thenReturn([
      {
        key: 'title',
        type: 'ish-select-field',
      },
      {
        key: 'firstName',
        type: 'ish-text-input-field',
        props: {
          required: true,
        },
      },
      {
        key: 'lastName',
        type: 'ish-text-input-field',
      },
      {
        key: 'phoneHome',
        type: 'ish-phone-field',
      },
    ]);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [AccountProfileUserComponent, MockComponent(ErrorMessageComponent)],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
        { provide: AppFacade, useFactory: () => instance(appFacadeMock) },
        { provide: FieldLibrary, useFactory: () => instance(fieldLibraryMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileUserComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    currentUser = { firstName: 'Patricia', lastName: 'Miller' } as User;
    component.currentUser = currentUser;

    invalidUser = { firstName: '', lastName: '' } as User;

    when(appFacadeMock.serverSetting$(anything())).thenReturn(of(true));

    when(accountFacadeMock.subscribedToNewsletter$).thenReturn(of(true));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display 3 input fields for firstName, lastName and phone', () => {
    fixture.detectChanges();

    expect(element.innerHTML.match(/ish-text-input-field/g)).toHaveLength(2);
    expect(element.innerHTML.match(/ish-phone-field/g)).toHaveLength(1);

    expect(element.innerHTML).toContain('firstName');
    expect(element.innerHTML).toContain('lastName');
    expect(element.innerHTML).toContain('phone');
  });

  it('should display select box for title', () => {
    fixture.detectChanges();

    expect(element.innerHTML.match('ish-select-field')).toHaveLength(1);
    expect(element.innerHTML).toContain('title');
  });

  it('should display checkbox for newsletter subscription', () => {
    fixture.detectChanges();

    expect(element.innerHTML).toContain('newsletter');
  });

  it('should emit updateUserProfile event if form is valid', () => {
    const eventEmitter$ = spy(component.updateUserProfile);

    fixture.detectChanges();

    component.submitForm();

    verify(eventEmitter$.emit(anything())).once();
  });

  it('should not emit updateUserProfile event if form is invalid', () => {
    const eventEmitter$ = spy(component.updateUserProfile);

    component.currentUser = invalidUser;

    fixture.detectChanges();

    component.submitForm();

    verify(eventEmitter$.emit(anything())).never();
  });
});
