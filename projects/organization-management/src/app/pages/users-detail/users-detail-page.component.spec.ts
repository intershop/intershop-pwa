import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { User } from 'ish-core/models/user/user.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { UsersDetailPageComponent } from './users-detail-page.component';

describe('Users Detail Page Component', () => {
  let component: UsersDetailPageComponent;
  let fixture: ComponentFixture<UsersDetailPageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;

  const user = { login: '1', firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' } as User;

  beforeEach(() => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), UsersDetailPageComponent],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    });

    fixture = TestBed.createComponent(UsersDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(organizationManagementFacade.currentUser$).thenReturn(of(user));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display user data after creation ', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="name-field"]').innerHTML).toBe('Patricia Miller');
    expect(element.querySelector('[data-testing-id="email-field"]').innerHTML).toBe('pmiller@test.intershop.de');
    expect(element.querySelector('[data-testing-id="phone-label"]')).toBeTruthy();
  });
});
