import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { BudgetInfoComponent } from '../../components/budget-info/budget-info.component';
import { CostCenterBudgetComponent } from '../../components/cost-center-budget/cost-center-budget.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCentersPageComponent } from './cost-centers-page.component';

describe('Cost Centers Page Component', () => {
  let component: CostCentersPageComponent;
  let fixture: ComponentFixture<CostCentersPageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;

  const costCenters = [
    { id: '123', name: 'cost center 1', active: true },
    { id: '345', name: 'cost center 2', active: false },
    { id: '678', name: 'cost center 3', active: true },
  ] as CostCenter[];

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    await TestBed.configureTestingModule({
      imports: [CdkTableModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CostCentersPageComponent,
        MockComponent(BudgetInfoComponent),
        MockComponent(CostCenterBudgetComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(ModalDialogComponent),
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();

    when(organizationManagementFacade.costCenters$).thenReturn(of(costCenters));
    when(organizationManagementFacade.isCostCenterEditable(anything())).thenReturn(of(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCentersPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.columnsToDisplay = ['costCenterId', 'costCenterName', 'costCenterBudget', 'actions'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list text if there are no cost centers', () => {
    when(organizationManagementFacade.costCenters$).thenReturn(of([]));
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyList]')).toBeTruthy();
  });

  it('should display loading overlay if cost centers are loading', () => {
    when(organizationManagementFacade.costCentersLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should display a list if there are cost centers in store', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=costCenter-list]')).toBeTruthy();
    expect(element.querySelectorAll('[data-testing-id=costCenter-list] td')).toHaveLength(12);
    expect(element.querySelectorAll('ish-cost-center-budget')).toHaveLength(3);
  });

  it('should display action buttons in dependance of the cost center active flag', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('[data-testing-id=deactivate-cost-center]')).toHaveLength(2);
    expect(element.querySelectorAll('[data-testing-id=activate-cost-center]')).toHaveLength(1);
    expect(element.querySelectorAll('[data-testing-id=delete-cost-center]')).toHaveLength(3);
  });

  it('should display no action buttons if the user is not allowed to change the cost center', () => {
    when(organizationManagementFacade.isCostCenterEditable(anything())).thenReturn(of(false));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=deactivate-cost-center]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=activate-cost-center]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=delete-cost-center]')).toBeFalsy();
  });
});
