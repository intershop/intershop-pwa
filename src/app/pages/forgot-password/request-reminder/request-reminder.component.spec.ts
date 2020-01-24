import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { RequestReminderFormComponent } from '../request-reminder-form/request-reminder-form.component';
import { UpdatePasswordFormComponent } from '../update-password-form/update-password-form.component';

import { RequestReminderComponent } from './request-reminder.component';

describe('Request Reminder Component', () => {
  let component: RequestReminderComponent;
  let fixture: ComponentFixture<RequestReminderComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(RequestReminderFormComponent),
        MockComponent(UpdatePasswordFormComponent),
        MockDirective(ServerHtmlDirective),
        RequestReminderComponent,
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot(), ngrxTesting({ reducers: coreReducers })],
    }).compileComponents();
  }));

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

  it('should render request reminder form on forgot-password request reminder page', async(() => {
    fixture.detectChanges();
    expect(element.querySelector('ish-request-reminder-form')).toBeTruthy();
  }));
});
