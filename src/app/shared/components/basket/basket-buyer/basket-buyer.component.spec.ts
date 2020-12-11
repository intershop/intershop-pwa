import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { BasketBuyerComponent } from './basket-buyer.component';

describe('Basket Buyer Component', () => {
  let component: BasketBuyerComponent;
  let fixture: ComponentFixture<BasketBuyerComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [BasketBuyerComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    accountFacade = mock(AccountFacade);

    fixture = TestBed.createComponent(BasketBuyerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.object = BasketMockData.getBasket();

    when(accountFacade.user$).thenReturn(of({ firstName: 'Patricia', lastName: 'Miller' } as User));
    when(accountFacade.customer$).thenReturn(of({ companyName: 'OilCorp', taxationID: '1234' } as Customer));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the taxation id of the customer', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="taxationID"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="taxationID"]').innerHTML).toContain('1234');
  });
});
