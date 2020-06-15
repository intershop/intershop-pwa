import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { User } from 'ish-core/models/user/user.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { UsersPageComponent } from './users-page.component';

describe('Users Page Component', () => {
  let component: UsersPageComponent;
  let fixture: ComponentFixture<UsersPageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;

  const users = [
    { firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' },
    { firstName: 'Jack', lastName: 'Link', email: 'jlink@test.intershop.de' },
  ] as User[];

  beforeEach(async(() => {
    organizationManagementFacade = mock(OrganizationManagementFacade);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(ModalDialogComponent),
        UsersPageComponent,
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  }));

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

  it('should display user list after creation ', () => {
    when(organizationManagementFacade.users$()).thenReturn(of(users));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="user-list"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="user-list"]').innerHTML).toContain('Patricia Miller');
  });
});
