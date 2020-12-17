import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bRole } from '../../models/b2b-role/b2b-role.model';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import { UserDetailBudgetComponent } from './user-detail-budget/user-detail-budget.component';
import { UserDetailPageComponent } from './user-detail-page.component';

describe('User Detail Page Component', () => {
  let component: UserDetailPageComponent;
  let fixture: ComponentFixture<UserDetailPageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;

  beforeEach(async () => {
    const user = {
      login: '1',
      firstName: 'Patricia',
      lastName: 'Miller',
      email: 'pmiller@test.intershop.de',
      roleIDs: ['BUYER', 'APPROVER'],
    } as B2bUser;

    organizationManagementFacade = mock(OrganizationManagementFacade);
    when(organizationManagementFacade.selectedUser$).thenReturn(of(user));

    when(organizationManagementFacade.roles$(anything())).thenReturn(
      of([
        { displayName: 'Buyer', permissionDisplayNames: ['buy', 'shop'] },
        { displayName: 'Approver', permissionDisplayNames: ['approve'] },
      ] as B2bRole[])
    );

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(UserDetailBudgetComponent),
        MockPipe(ServerSettingPipe),
        UserDetailPageComponent,
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display user data after creation ', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="name-field"]').textContent).toMatchInlineSnapshot(
      `" Patricia Miller "`
    );
    expect(element.querySelector('[data-testing-id="email-field"]').textContent).toMatchInlineSnapshot(
      `"pmiller@test.intershop.de"`
    );
    expect(element.querySelector('[data-testing-id="user-roles-fields"]').textContent).toMatchInlineSnapshot(
      `"BuyerbuyshopApproverapprove"`
    );
  });
});
