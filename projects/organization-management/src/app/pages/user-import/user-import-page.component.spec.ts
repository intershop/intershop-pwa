import { CdkTableModule } from '@angular/cdk/table';
import { AsyncPipe, NgClass } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink, provideRouter } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { UserRolesBadgesComponent } from '../users/user-roles-badges/user-roles-badges.component';

import { UserImportPageComponent } from './user-import-page.component';

describe('User Import Page Component', () => {
  let component: UserImportPageComponent;
  let fixture: ComponentFixture<UserImportPageComponent>;
  let element: HTMLElement;

  let organizationManagementFacade: OrganizationManagementFacade;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), UserImportPageComponent],
      providers: [
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) },
        provideRouter([]),
      ],
    })
      .overrideComponent(UserImportPageComponent, {
        set: {
          imports: [
            AsyncPipe,
            CdkTableModule,
            MockComponent(LoadingComponent),
            NgClass,
            TranslatePipe,
            MockPipe(PricePipe),
            MockComponent(UserRolesBadgesComponent),
            RouterLink,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImportPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
