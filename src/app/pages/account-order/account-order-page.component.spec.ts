import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { AccountOrderPageComponent } from './account-order-page.component';
import { AccountOrderComponent } from './account-order/account-order.component';

describe('Account Order Page Component', () => {
  let component: AccountOrderPageComponent;
  let fixture: ComponentFixture<AccountOrderPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ngrxTesting({ reducers: { ...coreReducers, shopping: combineReducers(shoppingReducers) } })],
      declarations: [AccountOrderPageComponent, MockComponent(AccountOrderComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
