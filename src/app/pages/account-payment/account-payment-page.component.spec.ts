import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { AccountPaymentPageComponent } from './account-payment-page.component';
import { AccountPaymentComponent } from './account-payment/account-payment.component';

describe('Account Payment Page Component', () => {
  let component: AccountPaymentPageComponent;
  let fixture: ComponentFixture<AccountPaymentPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        AccountPaymentPageComponent,
        MockComponent(AccountPaymentComponent),
        MockComponent(ErrorMessageComponent),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPaymentPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(accountFacade.userError$).thenReturn(of(undefined));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
