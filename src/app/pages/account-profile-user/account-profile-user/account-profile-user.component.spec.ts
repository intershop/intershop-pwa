import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, spy, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { User } from 'ish-core/models/user/user.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { AccountProfileUserComponent } from './account-profile-user.component';

describe('Account Profile User Component', () => {
  let component: AccountProfileUserComponent;
  let fixture: ComponentFixture<AccountProfileUserComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;

  beforeEach(async () => {
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [AccountProfileUserComponent, MockComponent(ErrorMessageComponent)],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileUserComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(appFacade.currentLocale$).thenReturn(of({ lang: 'en_US' } as Locale));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display 3 input fields for firstName, lastName and phone', () => {
    fixture.detectChanges();

    expect(element.innerHTML.match(/ish-text-input-field/g)).toHaveLength(3);

    expect(element.innerHTML).toContain('firstName');
    expect(element.innerHTML).toContain('lastName');
    expect(element.innerHTML).toContain('phone');
  });

  it('should display select box for title', () => {
    fixture.detectChanges();

    expect(element.innerHTML.match('ish-select-field')).toHaveLength(1);
    expect(element.innerHTML).toContain('title');
  });

  it('should emit updateUserProfile event if form is valid', () => {
    const eventEmitter$ = spy(component.updateUserProfile);

    component.countryCode = 'US';
    component.currentUser = { firstName: 'Patricia', lastName: 'Miller' } as User;
    fixture.detectChanges();

    component.submit();

    verify(eventEmitter$.emit(anything())).once();
  });

  it('should not emit updateUserProfile event if form is invalid', () => {
    const eventEmitter$ = spy(component.updateUserProfile);
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
