import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { AccountAddressesPageContainerComponent } from './account-addresses-page.container';
import { AccountAddressesComponent } from './components/account-addresses/account-addresses.component';

describe('Account Addresses Page Container', () => {
  let component: AccountAddressesPageContainerComponent;
  let fixture: ComponentFixture<AccountAddressesPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountAddressesPageContainerComponent,
        MockComponent(AccountAddressesComponent),
        MockComponent(LoadingComponent),
      ],
      imports: [ngrxTesting({ reducers: coreReducers })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAddressesPageContainerComponent);
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
