import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { instance, mock, verify } from 'ts-mockito';

import { CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { CsvImportData } from 'ish-core/utils/csv/csv.import-handler';

import { OrganizationManagementFacade } from '../../../facades/organization-management.facade';

import { CostCenterCsvImportComponent } from './cost-center-csv-import.component';

const costCenterTestData: CostCenterBase[] = [
  {
    id: undefined,
    costCenterId: '123',
    name: 'Test Center 1',
    budget: { type: 'Money', value: 1000, currency: 'USD' },
    budgetPeriod: 'yearly',
    costCenterOwner: { login: 'owner1' },
    active: true,
  },
  {
    id: undefined,
    costCenterId: '456',
    name: 'Test Center 2',
    budget: { type: 'Money', value: 2000, currency: 'EUR' },
    budgetPeriod: 'monthly',
    costCenterOwner: { login: 'owner2' },
    active: false,
  },
];

describe('Cost Center Csv Import Component', () => {
  let component: CostCenterCsvImportComponent;
  let fixture: ComponentFixture<CostCenterCsvImportComponent>;
  let organizationManagementFacadeMock: OrganizationManagementFacade;
  let element: HTMLElement;

  beforeEach(async () => {
    organizationManagementFacadeMock = mock(OrganizationManagementFacade);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslatePipe],
      declarations: [CostCenterCsvImportComponent],
      providers: [
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacadeMock) },
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterCsvImportComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should parse CSV correctly', () => {
    const csvParsedEvent: CsvImportData = {
      headers: component.costCenterHeaders,
      data: ['123,Test Center,USD,1000,monthly,owner,true'],
    };

    const parsedData: CostCenterBase[] = component.parseCsvData(csvParsedEvent);

    expect(parsedData).toBeTruthy();
    expect(parsedData).toHaveLength(1);

    const row = parsedData[0];
    expect(row.costCenterId).toEqual('123');
    expect(row.name).toEqual('Test Center');
    expect(row.budget).toEqual({ type: 'Money', value: 1000, currency: 'USD' });
    expect(row.costCenterOwner).toEqual({ login: 'owner' });
  });

  it('should handle empty CSV', () => {
    const csvParsedEvent: CsvImportData = {
      headers: component.costCenterHeaders,
      data: [''],
    };

    const parsedData: CostCenterBase[] = component.parseCsvData(csvParsedEvent);

    expect(parsedData).toBeTruthy();
    expect(parsedData).toHaveLength(1);
  });

  it('should call addCostCenterFromCSV on submit', () => {
    const csvData: CostCenterBase[] = [costCenterTestData[0]];

    component.parsedCostCenters = csvData;

    component.submitCostCenters();

    verify(organizationManagementFacadeMock.addCostCentersFromCsv(component.parsedCostCenters)).once();
  });

  it('should not call addCostCenterFromCSV when csvData is empty', () => {
    component.parsedCostCenters = [];
    component.submitCostCenters();

    verify(organizationManagementFacadeMock.addCostCentersFromCsv(component.parsedCostCenters)).never();
  });

  it('should reset the csv data', () => {
    component.parsedCostCenters = costCenterTestData;
    component.resetInput();

    expect(component.parsedCostCenters).toBeEmpty();
  });
});
