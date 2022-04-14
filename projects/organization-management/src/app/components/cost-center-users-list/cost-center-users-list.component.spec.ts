import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { NotRoleToggleDirective } from 'ish-core/directives/not-role-toggle.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { CostCenter, CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { CostCenterBuyerEditDialogComponent } from '../cost-center-buyer-edit-dialog/cost-center-buyer-edit-dialog.component';

import { CostCenterUsersListComponent } from './cost-center-users-list.component';

describe('Cost Center Users List Component', () => {
  let component: CostCenterUsersListComponent;
  let fixture: ComponentFixture<CostCenterUsersListComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;

  const costCenter = {
    costCenterId: '100400',
    buyers: [
      {
        firstName: 'Jack',
        lastName: 'Link',
        budget: {
          currency: 'USD',
          value: 500,
        } as Price,
        budgetPeriod: 'monthly',
      },
    ] as CostCenterBuyer[],
  } as CostCenter;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [CdkTableModule, TranslateModule.forRoot()],
      declarations: [
        CostCenterUsersListComponent,
        MockComponent(CostCenterBuyerEditDialogComponent),
        MockComponent(ModalDialogComponent),
        MockDirective(AuthorizationToggleDirective),
        MockDirective(NotRoleToggleDirective),
        MockDirective(ServerHtmlDirective),
        MockPipe(PricePipe),
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterUsersListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.costCenter = costCenter;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list text if there are no cost center buyers', () => {
    component.costCenter.buyers = [];
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyBuyerList]')).toBeTruthy();
  });

  it('should display a list if there are cost center buyers provided', () => {
    component.costCenter.buyers = [
      { firstName: 'buyer', lastName: '1' },
      { firstName: 'buyer', lastName: '2' },
    ] as CostCenterBuyer[];
    fixture.detectChanges();

    expect(element.querySelector('table.cdk-table')).toBeTruthy();
    expect(element.querySelectorAll('table tr.cdk-row')).toHaveLength(2);
  });
});
