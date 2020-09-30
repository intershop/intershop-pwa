import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { UserRolesSelectionComponent } from './user-roles-selection.component';

describe('User Roles Selection Component', () => {
  let component: UserRolesSelectionComponent;
  let fixture: ComponentFixture<UserRolesSelectionComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const organizationManagementFacade = mock(OrganizationManagementFacade);
    const buyerRole = {
      id: 'APP_B2B_BUYER',
      displayName: 'Buyer',
      permissionDisplayNames: ['buy', 'shop'],
      fixed: true,
    };
    const approverRole = {
      id: 'APP_B2B_APPROVER',
      displayName: 'Approver',
      permissionDisplayNames: ['approve'],
      fixed: false,
    };
    when(organizationManagementFacade.availableRoles$).thenReturn(of([buyerRole, approverRole]));
    when(organizationManagementFacade.role$(buyerRole.id)).thenReturn(of(buyerRole));
    when(organizationManagementFacade.role$(approverRole.id)).thenReturn(of(approverRole));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), UserRolesSelectionComponent],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesSelectionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display role selection form when rendered', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('.form-control-checkbox')).toHaveLength(2);
  });

  it('should disable static roles when rendering', () => {
    fixture.detectChanges();

    expect(element.querySelector('input[disabled]').parentElement.textContent).toMatchInlineSnapshot(`"Buyer"`);
  });

  it('should not display permissions when rendered', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="user_permissions"]')).toBeFalsy();
  });

  it('should display permissions when requested', () => {
    component.isExpanded[0] = true;
    fixture.detectChanges();

    expect(element.querySelectorAll('[data-testing-id="user_permissions"] li')).toHaveLength(2);
  });
});
