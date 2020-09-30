import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { OrganizationManagementFacade } from '../../../facades/organization-management.facade';

import { UserRolesBadgesComponent } from './user-roles-badges.component';

describe('User Roles Badges Component', () => {
  let component: UserRolesBadgesComponent;
  let fixture: ComponentFixture<UserRolesBadgesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRolesBadgesComponent],
      providers: [
        { provide: OrganizationManagementFacade, useFactory: () => instance(mock(OrganizationManagementFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesBadgesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
