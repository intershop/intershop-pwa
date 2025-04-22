import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterImportPageComponent } from './cost-center-import-page.component';

type CostCenterBaseWithStatus = CostCenterBase & { status?: string };

describe('Cost Center Import Page Component', () => {
  let component: CostCenterImportPageComponent;
  let fixture: ComponentFixture<CostCenterImportPageComponent>;
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

  const cdrMock = {
    detectChanges: jest.fn(),
  };

  const organizationManagementFacadeMock = {
    addCostCenterFromCSV: jest.fn(() => of({ success: true })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostCenterImportPageComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ChangeDetectorRef, useValue: cdrMock },
        { provide: OrganizationManagementFacade, useValue: organizationManagementFacadeMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterImportPageComponent);
    component = fixture.componentInstance;
    cdrMock.detectChanges.mockClear();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(CostCenterImportPageComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should parse CSV correctly', () => {
    const csvText =
      'costCenterId,name,budgetValue,budgetCurrency,costCenterOwnerLogin,active\n' + '123,Test Center,1000,USD,owner';

    component.parseCSV(csvText);

    let parsedData: CostCenterBase[] = [];
    component.csvData$.subscribe(data => (parsedData = data));

    expect(parsedData).toBeTruthy();
    expect(parsedData).toHaveLength(1);

    const row = parsedData[0];
    expect(row.costCenterId).toEqual('123');
    expect(row.name).toEqual('Test Center');
    expect(row.budget).toEqual({ type: 'Money', value: 1000, currency: 'USD' });
    expect(row.costCenterOwner).toEqual({ login: 'owner' });

    expect(component.loading$).toBeFalse();
  });

  it('should handle empty CSV', () => {
    const csvText = '';

    component.parseCSV(csvText);

    let parsedData: CostCenterBase[] = [];
    component.csvData$.subscribe(data => (parsedData = data));

    expect(parsedData).toBeTruthy();
    expect(parsedData).toHaveLength(0);
  });

  it('should update cost center status on success', () => {
    // Set the csvData$ observable to the initial data
    component.csvData$ = of(costCenterTestData);

    // Call updateCostCenterStatus with a success result.
    component.updateCostCenterStatus('123', of({ success: true }));

    let updatedData: CostCenterBaseWithStatus[] = [];
    component.csvData$.subscribe(data => (updatedData = data));

    expect(updatedData).toBeTruthy();
    expect(updatedData).toHaveLength(2);
    expect(updatedData[0].status).toEqual('Success');
  });

  it('should update cost center status on error', () => {
    // Set the csvData$ observable to the initial data
    component.csvData$ = of(costCenterTestData);

    // Call updateCostCenterStatus with an error result.
    component.updateCostCenterStatus('123', of({ success: false, message: 'Error occurred' }));

    let updatedData: CostCenterBaseWithStatus[] = [];
    component.csvData$.subscribe(data => (updatedData = data));

    expect(updatedData).toBeTruthy();
    expect(updatedData).toHaveLength(2);
    expect(updatedData[0].status).toEqual('Error: Error occurred');
  });

  it('should call addCostCenterFromCSV on submit', () => {
    const csvData: CostCenterBase[] = [costCenterTestData[0]];

    component.csvData$ = of(csvData);

    component.submitCostCenterImports();

    expect(organizationManagementFacadeMock.addCostCenterFromCSV).toHaveBeenCalledWith(csvData[0]);
  });

  it('should handle error during import', () => {
    const csvData: CostCenterBase[] = [costCenterTestData[0]];

    component.csvData$ = of(csvData);

    organizationManagementFacadeMock.addCostCenterFromCSV.mockReturnValueOnce(
      of({ success: false, message: 'Import failed' })
    );

    component.submitCostCenterImports();

    expect(organizationManagementFacadeMock.addCostCenterFromCSV).toHaveBeenCalledWith(csvData[0]);
    expect(component.csvData$).toBeTruthy();
  });

  it('should handle unknown error during import', () => {
    const csvData: CostCenterBase[] = [costCenterTestData[0]];

    component.csvData$ = of(csvData);

    organizationManagementFacadeMock.addCostCenterFromCSV.mockReturnValueOnce(
      of({ success: false, message: undefined })
    );

    component.submitCostCenterImports();

    expect(organizationManagementFacadeMock.addCostCenterFromCSV).toHaveBeenCalledWith(csvData[0]);
    expect(component.csvData$).toBeTruthy();
  });

  it('should not call addCostCenterFromCSV when csvData is empty', () => {
    organizationManagementFacadeMock.addCostCenterFromCSV.mockClear();

    component.csvData$ = of([]);
    component.submitCostCenterImports();

    expect(organizationManagementFacadeMock.addCostCenterFromCSV).not.toHaveBeenCalled();
  });

  it('should handle file selection with invalid file type', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } } as unknown as Event;

    global.alert = jest.fn();

    component.onFileSelected(event);

    expect(global.alert).toHaveBeenCalledWith('Please chose a CSV-file.');
  });

  it('should handle malformed CSV data', () => {
    const invalidCsvText = 'invalid,csv\ndata,without,matching,headers';

    component.parseCSV(invalidCsvText);

    let parsedData: CostCenterBase[] = [];
    component.csvData$.subscribe(data => (parsedData = data));

    expect(parsedData).toBeTruthy();
    expect(parsedData).toHaveLength(1);
    expect(parsedData[0].costCenterId).toBeUndefined();
  });
});
