import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import { UserDetailPageComponent } from './user-detail-page.component';

describe('User Detail Page Component', () => {
  let component: UserDetailPageComponent;
  let fixture: ComponentFixture<UserDetailPageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;

  const user = { login: '1', firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' } as B2bUser;

  beforeEach(async(() => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), UserDetailPageComponent],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  }));

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
    when(organizationManagementFacade.selectedUser$).thenReturn(of(user));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="name-field"]').innerHTML).toContain('Patricia Miller');
    expect(element.querySelector('[data-testing-id="email-field"]').innerHTML).toBe('pmiller@test.intershop.de');
    expect(element.querySelector('[data-testing-id="phone-label"]')).toBeTruthy();
  });
});
