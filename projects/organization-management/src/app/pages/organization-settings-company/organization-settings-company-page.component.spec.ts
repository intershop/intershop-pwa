import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';

import { OrganizationSettingsCompanyPageComponent } from './organization-settings-company-page.component';
import { OrganizationSettingsCompanyComponent } from './organization-settings-company/organization-settings-company.component';

describe('Organization Settings Company Page Component', () => {
  let component: OrganizationSettingsCompanyPageComponent;
  let fixture: ComponentFixture<OrganizationSettingsCompanyPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    when(accountFacade.customer$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [MockComponent(OrganizationSettingsCompanyComponent), OrganizationSettingsCompanyPageComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationSettingsCompanyPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render organization-settings-company component for a business customer', () => {
    const businessCustomer = {
      customerNo: '4711',
      isBusinessCustomer: true,
    } as Customer;
    when(accountFacade.customer$).thenReturn(of(businessCustomer));

    fixture.detectChanges();
    expect(element.querySelector('ish-organization-settings-company')).toBeTruthy();
  });

  it('should not render organization-settings-company component for a private customer', () => {
    const privateCustomer = {
      customerNo: '4712',
      isBusinessCustomer: false,
    } as Customer;
    when(accountFacade.customer$).thenReturn(of(privateCustomer));

    fixture.detectChanges();
    expect(element.querySelector('ish-organization-settings-company')).toBeFalsy();
  });
});
