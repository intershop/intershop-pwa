import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { BudgetInfoComponent } from '../../components/budget-info/budget-info.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import { UserRolesBadgesComponent } from './user-roles-badges/user-roles-badges.component';
import { UsersPageComponent } from './users-page.component';

describe('Users Page Component', () => {
  let component: UsersPageComponent;
  let fixture: ComponentFixture<UsersPageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  let accountFacade: AccountFacade;

  const users = [
    { firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' },
    { firstName: 'Jack', lastName: 'Link', name: 'Jack Link', email: 'jlink@test.intershop.de' },
  ] as B2bUser[];

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(BudgetInfoComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(UserRolesBadgesComponent),
        MockPipe(ServerSettingPipe),
        UsersPageComponent,
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display loading overlay if users are loading', () => {
    when(organizationManagementFacade.usersLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should display user list after creation', () => {
    when(organizationManagementFacade.users$).thenReturn(of(users));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="user-list"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="user-list"]').innerHTML).toContain('Patricia Miller');
  });
});
