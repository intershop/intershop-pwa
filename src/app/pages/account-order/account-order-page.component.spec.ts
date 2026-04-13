import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { AccountOrderPageComponent } from './account-order-page.component';
import { AccountOrderComponent } from './account-order/account-order.component';

describe('Account Order Page Component', () => {
  let component: AccountOrderPageComponent;
  let fixture: ComponentFixture<AccountOrderPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.selectedOrder$).thenReturn(of(undefined));

    await TestBed.configureTestingModule({
      imports: [AccountOrderPageComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    })
      .overrideComponent(AccountOrderPageComponent, {
        remove: { imports: [AccountOrderComponent] },
        add: { imports: [MockComponent(AccountOrderComponent)] },
      })
      .compileComponents();
  });

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
