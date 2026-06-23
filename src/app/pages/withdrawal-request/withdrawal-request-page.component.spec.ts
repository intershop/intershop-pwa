import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { WithdrawalFacade } from 'ish-core/facades/withdrawal.facade';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';

import { WithdrawalRequestFormComponent } from './withdrawal-request-form/withdrawal-request-form.component';
import { WithdrawalRequestPageComponent } from './withdrawal-request-page.component';

describe('Withdrawal Request Page Component', () => {
  let component: WithdrawalRequestPageComponent;
  let fixture: ComponentFixture<WithdrawalRequestPageComponent>;
  let element: HTMLElement;
  let withdrawalFacade: WithdrawalFacade;

  beforeEach(async () => {
    withdrawalFacade = mock(WithdrawalFacade);
    when(withdrawalFacade.withdrawal).thenReturn(signal(undefined));
    when(withdrawalFacade.loading).thenReturn(signal(false));
    when(withdrawalFacade.error).thenReturn(signal(undefined));
    when(withdrawalFacade.initialized).thenReturn(signal(true));

    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [
        MockComponent(WithdrawalRequestFormComponent),
        MockDirective(ServerHtmlDirective),
        WithdrawalRequestPageComponent,
      ],
      providers: [provideTranslateService()],
    })
      .overrideComponent(WithdrawalRequestPageComponent, {
        set: { providers: [{ provide: WithdrawalFacade, useFactory: () => instance(withdrawalFacade) }] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalRequestPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should delegate createWithdrawal to facade', () => {
    component.createWithdrawal({ orderDocumentNumber: '12345', orderEmail: 'test@example.com' });
    verify(
      withdrawalFacade.createWithdrawal(deepEqual({ orderDocumentNumber: '12345', orderEmail: 'test@example.com' }))
    ).once();
  });

  it('should delegate submitWithdrawal to facade', () => {
    const withdrawal = { orderDocumentNumber: '12345' } as Withdrawal;
    component.submitWithdrawal(withdrawal);
    verify(withdrawalFacade.sendWithdrawal(withdrawal)).once();
  });
});
