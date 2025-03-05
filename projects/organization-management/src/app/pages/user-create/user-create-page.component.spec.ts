import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';

import { UserProfileFormComponent } from '../../components/user-profile-form/user-profile-form.component';
import { UserRolesSelectionComponent } from '../../components/user-roles-selection/user-roles-selection.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { UserCreatePageComponent } from './user-create-page.component';

describe('User Create Page Component', () => {
  let component: UserCreatePageComponent;
  let fixture: ComponentFixture<UserCreatePageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(UserProfileFormComponent),
        MockComponent(UserRolesSelectionComponent),
        MockPipe(ServerSettingPipe),
        UserCreatePageComponent,
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreatePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
