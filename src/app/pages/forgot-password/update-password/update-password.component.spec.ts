import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { RequestReminderFormComponent } from '../request-reminder-form/request-reminder-form.component';
import { UpdatePasswordFormComponent } from '../update-password-form/update-password-form.component';

import { UpdatePasswordComponent } from './update-password.component';

describe('Update Password Component', () => {
  let component: UpdatePasswordComponent;
  let fixture: ComponentFixture<UpdatePasswordComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.passwordReminderSuccess$).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
        MockComponent(RequestReminderFormComponent),
        MockComponent(UpdatePasswordFormComponent),
        MockDirective(ServerHtmlDirective),
        UpdatePasswordComponent,
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePasswordComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render update password form on forgot-password update password page', async(() => {
    component.secureCode = 'abc';
    component.userID = 'a123';
    fixture.detectChanges();
    expect(element.querySelector('ish-update-password-form')).toBeTruthy();
  }));
});
