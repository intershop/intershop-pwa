import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountAddressesPageComponent } from './account-addresses-page.component';
import { AccountAddressesComponent } from './account-addresses/account-addresses.component';

describe('Account Addresses Page Component', () => {
  let component: AccountAddressesPageComponent;
  let fixture: ComponentFixture<AccountAddressesPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountAddressesPageComponent,
        MockComponent(AccountAddressesComponent),
        MockComponent(LoadingComponent),
      ],
      imports: [ngrxTesting({ reducers: coreReducers })],
    }).compileComponents();
  }));

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
