import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock, verify, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { WithdrawalFacade } from 'ish-core/facades/withdrawal.facade';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { WithdrawalFormComponent } from './withdrawal-form/withdrawal-form.component';
import { WithdrawalRequestComponent } from './withdrawal-request.component';

describe('Withdrawal Request Component', () => {
  let component: WithdrawalRequestComponent;
  let fixture: ComponentFixture<WithdrawalRequestComponent>;
  let element: HTMLElement;
  let withdrawalFacade: WithdrawalFacade;

  beforeEach(async () => {
    withdrawalFacade = mock(WithdrawalFacade);
    when(withdrawalFacade.withdrawal).thenReturn(signal(undefined));
    when(withdrawalFacade.loading).thenReturn(signal(false));
    when(withdrawalFacade.error).thenReturn(signal(undefined));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
        MockComponent(WithdrawalFormComponent),
        MockDirective(ServerHtmlDirective),
        WithdrawalRequestComponent,
      ],
    })
      .overrideComponent(WithdrawalRequestComponent, {
        set: { providers: [{ provide: WithdrawalFacade, useFactory: () => instance(withdrawalFacade) }] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalRequestComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should call getWithdrawalFromLocalStorage on init', () => {
    fixture.detectChanges();
    verify(withdrawalFacade.getWithdrawalFromLocalStorage()).once();
  });

  it('should delegate createWithdrawal to facade', () => {
    component.createWithdrawal({ orderDocumentNumber: '12345', orderEmail: 'test@example.com' });
    verify(withdrawalFacade.createWithdrawal('12345', 'test@example.com')).once();
  });

  it('should delegate submitWithdrawal to facade', () => {
    const withdrawal = { orderDocumentNumber: '12345' } as Withdrawal;
    component.submitWithdrawal(withdrawal);
    verify(withdrawalFacade.sendWithdrawal(withdrawal)).once();
  });

  it('should call cleanup on destroy', () => {
    fixture.detectChanges();
    fixture.destroy();
    verify(withdrawalFacade.cleanup()).once();
  });
});
