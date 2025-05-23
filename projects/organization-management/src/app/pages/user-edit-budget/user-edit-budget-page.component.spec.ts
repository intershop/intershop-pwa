import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

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
        login: 'j.d@test.intershop.de',
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
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(ErrorMessageComponent), MockPipe(ServerSettingPipe), UserEditBudgetPageComponent],
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
});
