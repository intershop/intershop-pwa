import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { AccountOrderPageContainerComponent } from './account-order-page.container';
import { AccountOrderPageComponent } from './components/account-order-page/account-order-page.component';

describe('Account Order Page Container', () => {
  let component: AccountOrderPageContainerComponent;
  let fixture: ComponentFixture<AccountOrderPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ngrxTesting({ reducers: { ...coreReducers, shopping: combineReducers(shoppingReducers) } })],
      declarations: [AccountOrderPageContainerComponent, MockComponent(AccountOrderPageComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
