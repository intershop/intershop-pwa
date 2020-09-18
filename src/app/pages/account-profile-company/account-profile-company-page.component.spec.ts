import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountProfileCompanyPageComponent } from './account-profile-company-page.component';
import { AccountProfileCompanyComponent } from './account-profile-company/account-profile-company.component';

describe('Account Profile Company Page Component', () => {
  let component: AccountProfileCompanyPageComponent;
  let fixture: ComponentFixture<AccountProfileCompanyPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    when(accountFacade.customer$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AccountProfileCompanyPageComponent,
        MockComponent(AccountProfileCompanyComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileCompanyPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render account-profile-company component for a business customer', () => {
    const businessCustomer = {
      customerNo: '4711',
      isBusinessCustomer: true,
    } as Customer;
    when(accountFacade.customer$).thenReturn(of(businessCustomer));

    fixture.detectChanges();
    expect(element.querySelector('ish-account-profile-company')).toBeTruthy();
  });

  it('should not render account-profile-company component for a private customer', () => {
    const privateCustomer = {
      customerNo: '4712',
      isBusinessCustomer: false,
    } as Customer;
    when(accountFacade.customer$).thenReturn(of(privateCustomer));

    fixture.detectChanges();
    expect(element.querySelector('ish-account-profile-company')).toBeFalsy();
  });
});
