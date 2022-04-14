import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { UserRolesSelectionComponent } from '../../components/user-roles-selection/user-roles-selection.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import { UserEditRolesPageComponent } from './user-edit-roles-page.component';

describe('User Edit Roles Page Component', () => {
  let component: UserEditRolesPageComponent;
  let fixture: ComponentFixture<UserEditRolesPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const organizationManagementFacade = mock(OrganizationManagementFacade);
    when(organizationManagementFacade.selectedUser$).thenReturn(
      of({
        firstName: 'John',
        lastName: 'Doe',
        login: 'j.d@test.intershop.de',
        roleIDs: ['APP_B2B_BUYER'],
      } as B2bUser)
    );

    const accountFacade = mock(AccountFacade);
    when(accountFacade.user$).thenReturn(of({ login: 'boss@test.intershop.de' } as User));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(UserRolesSelectionComponent),
        UserEditRolesPageComponent,
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditRolesPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
