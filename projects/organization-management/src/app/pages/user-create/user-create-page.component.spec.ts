import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { UserBudgetFormComponent } from '../../components/user-budget-form/user-budget-form.component';
import { UserProfileFormComponent } from '../../components/user-profile-form/user-profile-form.component';
import { UserRolesSelectionComponent } from '../../components/user-roles-selection/user-roles-selection.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { UserCreatePageComponent } from './user-create-page.component';

describe('User Create Page Component', () => {
  let component: UserCreatePageComponent;
  let fixture: ComponentFixture<UserCreatePageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  let fb: FormBuilder;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(UserBudgetFormComponent),
        MockComponent(UserProfileFormComponent),
        MockComponent(UserRolesSelectionComponent),
        MockPipe(ServerSettingPipe),
        UserCreatePageComponent,
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

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
        active: [true],
      }),
      roleIDs: ['Buyer'],
      userBudget: fb.group({
        orderSpentLimitValue: ['70000'],
        budgetValue: [10000],
        budgetPeriod: ['monthly'],
        currency: 'USD',
      }),
    });

    expect(component.formDisabled).toBeFalse();
    component.submitForm();
    expect(component.formDisabled).toBeFalse();
  });

  it('should disable submit button when the user submits an invalid form', () => {
    fixture.detectChanges();

    component.form = fb.group({
      profile: fb.group({
        firstName: ['', [Validators.required]],
      }),
    });

    expect(component.formDisabled).toBeFalse();
    component.submitForm();
    expect(component.formDisabled).toBeTrue();
  });
});
