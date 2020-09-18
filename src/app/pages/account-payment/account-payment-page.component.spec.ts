import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountPaymentPageComponent } from './account-payment-page.component';
import { AccountPaymentComponent } from './account-payment/account-payment.component';

describe('Account Payment Page Component', () => {
  let component: AccountPaymentPageComponent;
  let fixture: ComponentFixture<AccountPaymentPageComponent>;
  let element: HTMLElement;
  const accountFacade = mock(AccountFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountPaymentPageComponent,
        MockComponent(AccountPaymentComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPaymentPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
