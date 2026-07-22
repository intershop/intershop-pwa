import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import { UserProfileFormComponent } from './user-profile-form.component';

describe('User Profile Form Component', () => {
  let component: UserProfileFormComponent;
  let fixture: ComponentFixture<UserProfileFormComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    when(appFacade.serverSetting$<string>(anyString())).thenReturn(of('email'));

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule.withPresetMocks(['title', 'firstName', 'lastName', 'phoneHome']), TranslatePipe],
      declarations: [MockComponent(ErrorMessageComponent), UserProfileFormComponent],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }, provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.form = new FormGroup({});
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display all form input fields for user creation', () => {
    fixture.detectChanges();

    expect(element.innerHTML).toContain('title');
    expect(element.innerHTML).toContain('firstName');
    expect(element.innerHTML).toContain('lastName');
    expect(element.innerHTML).toContain('phoneHome');
    expect(element.innerHTML).toContain('active');
    expect(element.innerHTML).toContain('email');
  });

  it('should display all form input fields except email for user update', () => {
    component.user = { firstName: 'Patricia', lastName: 'Miller', email: 'patricia@test.intershop.de' } as B2bUser;
    fixture.detectChanges();

    expect(element.innerHTML).toContain('title');
    expect(element.innerHTML).toContain('firstName');
    expect(element.innerHTML).toContain('lastName');
    expect(element.innerHTML).toContain('phoneHome');
    expect(element.innerHTML).toContain('active');
    expect(element.innerHTML).not.toContain('email');
  });

  it('should display login field when login type is not email', () => {
    when(appFacade.serverSetting$<string>(anyString())).thenReturn(of('username'));
    fixture.detectChanges();

    expect(element.innerHTML).toContain('login');
  });

  it('should not display login field when login type is email', () => {
    fixture.detectChanges();

    expect(element.innerHTML).not.toContain('login');
  });
});
