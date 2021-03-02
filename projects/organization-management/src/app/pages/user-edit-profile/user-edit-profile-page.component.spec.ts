import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { UserProfileFormComponent } from '../../components/user-profile-form/user-profile-form.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import { UserEditProfilePageComponent } from './user-edit-profile-page.component';

describe('User Edit Profile Page Component', () => {
  let component: UserEditProfilePageComponent;
  let fixture: ComponentFixture<UserEditProfilePageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  let fb: FormBuilder;

  const user = {
    login: '1',
    title: 'Mr.',
    firstName: 'Bernhard',
    lastName: 'Boldner',
    preferredLanguage: 'en_US',
    email: 'test@gmail.com',
  } as B2bUser;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(UserProfileFormComponent),
        UserEditProfilePageComponent,
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();

    when(organizationManagementFacade.selectedUser$).thenReturn(of(user));
    when(organizationManagementFacade.usersLoading$).thenReturn(of(false));
    when(organizationManagementFacade.usersError$).thenReturn(of());
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditProfilePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.inject(FormBuilder);

    component.profileForm = fb.group({
      profile: fb.group({
        title: [user.title, [Validators.required]],
        firstName: [user.firstName, [Validators.required]],
        lastName: [user.lastName, [Validators.required]],
        active: [true],
        preferredLanguage: [user.preferredLanguage, [Validators.required]],
      }),
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should submit a valid form when the user fills all required fields', () => {
    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitForm(user);
    expect(component.formDisabled).toBeFalse();
  });
});
