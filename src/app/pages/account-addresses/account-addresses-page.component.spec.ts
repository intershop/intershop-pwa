import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountAddressesPageComponent } from './account-addresses-page.component';
import { AccountAddressesComponent } from './account-addresses/account-addresses.component';

describe('Account Addresses Page Component', () => {
  let component: AccountAddressesPageComponent;
  let fixture: ComponentFixture<AccountAddressesPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountAddressesPageComponent,
        MockComponent(AccountAddressesComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAddressesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });
  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render account addresses component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-account-addresses')).toBeTruthy();
  });
});
