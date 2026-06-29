import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { UserBudgetFormComponent } from '../../components/user-budget-form/user-budget-form.component';
import { UserProfileFormComponent } from '../../components/user-profile-form/user-profile-form.component';
import { UserRolesSelectionComponent } from '../../components/user-roles-selection/user-roles-selection.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { UserCreatePageComponent } from './user-create-page.component';
import { UserCsvImportComponent } from './user-csv-import/user-csv-import.component';

describe('User Create Page Component', () => {
  let component: UserCreatePageComponent;
  let fixture: ComponentFixture<UserCreatePageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    await TestBed.configureTestingModule({
      imports: [UserCreatePageComponent],
      providers: [
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) },
        provideRouter([]),
        provideTranslateService(),
      ],
    })
      .overrideComponent(UserCreatePageComponent, {
        set: {
          imports: [
            AsyncPipe,
            MockDirective(FormSubmitDirective),
            MockComponent(LoadingComponent),
            ReactiveFormsModule,
            MockPipe(ServerSettingPipe),
            TranslatePipe,
            MockComponent(UserBudgetFormComponent),
            MockComponent(UserCsvImportComponent),
            MockComponent(UserProfileFormComponent),
            MockComponent(UserRolesSelectionComponent),
            RouterLink,
          ],
        },
      })
      .compileComponents();
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
