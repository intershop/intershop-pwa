import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock, verify } from 'ts-mockito';

import { CsvImportData } from 'ish-core/utils/csv/csv.import-handler';

import { OrganizationManagementFacade } from '../../../facades/organization-management.facade';
import { B2bUser } from '../../../models/b2b-user/b2b-user.model';

import { UserCsvImportComponent } from './user-csv-import.component';

const dummyUser: B2bUser = {
  businessPartnerNo: 'Udummy',
  roleIDs: [],
  userBudget: {
    budget: { type: 'Money', value: 500, currency: 'USD' },
    budgetPeriod: 'monthly',
    orderSpentLimit: { type: 'Money', value: 100, currency: 'USD' },
  },
  title: 'Mr.',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com',
  phoneHome: '1234567890',
  active: true,
};

describe('User Csv Import Component', () => {
  let component: UserCsvImportComponent;
  let fixture: ComponentFixture<UserCsvImportComponent>;
  let organizationManagementFacadeMock: OrganizationManagementFacade;
  let element: HTMLElement;

  beforeEach(async () => {
    organizationManagementFacadeMock = mock(OrganizationManagementFacade);
    await TestBed.configureTestingModule({
      declarations: [UserCsvImportComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCsvImportComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should parse CSV correctly', () => {
    const csvParsedEvent: CsvImportData = {
      headers: component.userHeaders,
      data: ['Dr.,John,Doe,test@example.com,1234567890,true,USD,500,monthly,USD,100,false,false,false,false,false'],
    };

    const parsedUsers = component.parseCsvData(csvParsedEvent);
    expect(parsedUsers).toBeTruthy();
    expect(parsedUsers).toHaveLength(1);

    const user = parsedUsers[0];
    expect(user.title).toEqual('Dr.');
    expect(user.firstName).toEqual('John');
    expect(user.lastName).toEqual('Doe');
    expect(user.email).toEqual('test@example.com');
    expect(user.phoneHome).toEqual('1234567890');
    expect(user.active).toBeTrue();

    expect(user.userBudget.budget).toEqual({ type: 'Money', value: 500, currency: 'USD' });
    expect(user.userBudget.budgetPeriod).toEqual('monthly');
    expect(user.userBudget.orderSpentLimit).toEqual({ type: 'Money', value: 100, currency: 'USD' });
  });

  it('should handle empty CSV data', () => {
    const csvParsedEvent: CsvImportData = {
      headers: component.userHeaders,
      data: [],
    };

    component.parsedUsers = component.parseCsvData(csvParsedEvent);
    expect(component.parsedUsers).toBeEmpty();
  });

  it('should call addUsersFromCsv on submit when parsedUsers is not empty', () => {
    component.parsedUsers = [dummyUser];
    component.submitUsers();

    verify(organizationManagementFacadeMock.addUsersFromCsv(component.parsedUsers)).once();
  });

  it('should not call addUsersFromCsv on submit when parsedUsers is empty', () => {
    component.parsedUsers = [];
    component.submitUsers();

    verify(organizationManagementFacadeMock.addUsersFromCsv(component.parsedUsers)).never();
  });

  it('should reset the csv data and status on resetInput', () => {
    component.status = 'Valid';

    component.resetInput();
    expect(component.parsedUsers).toBeEmpty();
    expect(component.status).toEqual('Default');
  });
});
