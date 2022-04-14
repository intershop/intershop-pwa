import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import { UserProfileFormComponent } from './user-profile-form.component';

describe('User Profile Form Component', () => {
  let component: UserProfileFormComponent;
  let fixture: ComponentFixture<UserProfileFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyTestingModule.withPresetMocks(['title', 'firstName', 'lastName', 'phoneHome']),
        TranslateModule.forRoot(),
      ],
      declarations: [MockComponent(ErrorMessageComponent), UserProfileFormComponent],
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
});
