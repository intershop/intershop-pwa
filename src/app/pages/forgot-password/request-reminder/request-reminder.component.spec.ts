import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { RequestReminderFormComponent } from '../request-reminder-form/request-reminder-form.component';

import { RequestReminderComponent } from './request-reminder.component';

describe('Request Reminder Component', () => {
  let component: RequestReminderComponent;
  let fixture: ComponentFixture<RequestReminderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const mockAppFacade = mock(AppFacade);
    when(mockAppFacade.serverSetting$<boolean>(anyString())).thenReturn(of(false));

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(RequestReminderFormComponent),
        MockDirective(ServerHtmlDirective),
        RequestReminderComponent,
      ],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: AppFacade, useFactory: () => instance(mockAppFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestReminderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render request reminder form on forgot-password request reminder page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-request-reminder-form')).toBeTruthy();
  });
});
