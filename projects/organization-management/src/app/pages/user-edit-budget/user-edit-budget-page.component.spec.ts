import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { UserBudgetFormComponent } from '../../components/user-budget-form/user-budget-form.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import { UserEditBudgetPageComponent } from './user-edit-budget-page.component';

describe('User Edit Budget Page Component', () => {
  let component: UserEditBudgetPageComponent;
  let fixture: ComponentFixture<UserEditBudgetPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const organizationManagementFacade = mock(OrganizationManagementFacade);
    when(organizationManagementFacade.selectedUser$).thenReturn(
      of({
        firstName: 'John',
        lastName: 'Doe',
        login: 'j.d@test.de',
        roleIDs: ['APP_B2B_BUYER'],
        userBudget: {
          budget: { value: 500, currency: 'USD' },
          orderSpentLimit: { value: 9000, currency: 'USD' },
          remainingBudget: { value: 500, currency: 'USD' },
          budgetPeriod: 'monthly',
        },
      } as B2bUser)
    );
    when(organizationManagementFacade.usersLoading$).thenReturn(of(false));
    when(organizationManagementFacade.usersError$).thenReturn(of());
    when(organizationManagementFacade.setSelectedUserBudget(anything())).thenReturn();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
        MockComponent(UserBudgetFormComponent),
        MockPipe(ServerSettingPipe),
        UserEditBudgetPageComponent,
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditBudgetPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should submit a valid form when the user fills all required fields', () => {
    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitForm();

    expect(component.formDisabled).toBeFalse();
  });
});
