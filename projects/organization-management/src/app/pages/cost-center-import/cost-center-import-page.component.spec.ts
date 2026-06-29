import { CdkTableModule } from '@angular/cdk/table';
import { AsyncPipe, NgClass } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { CostCenterImportResult } from 'ish-core/models/cost-center/cost-center.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterImportPageComponent } from './cost-center-import-page.component';

describe('Cost Center Import Page Component', () => {
  let component: CostCenterImportPageComponent;
  let fixture: ComponentFixture<CostCenterImportPageComponent>;

  const costCenterImportTestData: CostCenterImportResult[] = [
    {
      costCenter: {
        id: undefined,
        costCenterId: '123',
        name: 'Test Center 1',
        budget: { type: 'Money', value: 1000, currency: 'USD' },
        budgetPeriod: 'yearly',
        costCenterOwner: { login: 'owner1' },
        active: true,
      },
      status: 'Created successfully',
    },
    {
      costCenter: {
        id: undefined,
        costCenterId: '456',
        name: 'Test Center 2',
        budget: { type: 'Money', value: 2000, currency: 'EUR' },
        budgetPeriod: 'monthly',
        costCenterOwner: { login: 'owner2' },
        active: false,
      },
      status: 'Error: Invalid budget period',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostCenterImportPageComponent],
      providers: [
        {
          provide: OrganizationManagementFacade,
          useValue: {
            costCentersLoading$: of(false),
            costCentersImportResults$: of(costCenterImportTestData),
            costCentersImportTotal$: of(costCenterImportTestData.length),
          },
        },
        provideRouter([]),
        provideTranslateService(),
      ],
    })
      .overrideComponent(CostCenterImportPageComponent, {
        set: {
          imports: [AsyncPipe, CdkTableModule, MockComponent(LoadingComponent), NgClass, TranslatePipe, RouterLink],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterImportPageComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(CostCenterImportPageComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should display imported cost centers when data is available', () => {
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);

    const firstRow = rows[0];
    expect(firstRow.textContent).toContain('123');
    expect(firstRow.textContent).toContain('Test Center');
    expect(firstRow.textContent).toContain('1000 USD');
    expect(firstRow.textContent).toContain('yearly');
    expect(firstRow.textContent).toContain('Created successfully');
  });
});
