import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { UserProfileFormComponent } from '../../components/user/user-profile-form/user-profile-form.component';
import { UserRolesSelectionComponent } from '../../components/user/user-roles-selection/user-roles-selection.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { UserCreatePageComponent } from './user-create-page.component';

describe('User Create Page Component', () => {
  let component: UserCreatePageComponent;
  let fixture: ComponentFixture<UserCreatePageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  let fb: FormBuilder;

  beforeEach(async(() => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(UserProfileFormComponent),
        MockComponent(UserRolesSelectionComponent),
        UserCreatePageComponent,
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreatePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.inject(FormBuilder);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should submit a valid form when the user fills all required fields', () => {
    fixture.detectChanges();

    component.form = fb.group({
      profile: fb.group({
        firstName: ['Bernhard', [Validators.required]],
        lastName: ['Boldner', [Validators.required]],
        email: ['test@gmail.com', [Validators.required, SpecialValidators.email]],
        preferredLanguage: ['en_US', [Validators.required]],
      }),
    });

    expect(component.formDisabled).toBeFalse();
    component.submitForm();
    expect(component.formDisabled).toBeFalse();
  });

  it('should disable submit button when the user submits an invalid form', () => {
    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitForm();
    expect(component.formDisabled).toBeTrue();
  });
});
