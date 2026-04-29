import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { WithdrawalData } from 'ish-core/models/withdrawal/withdrawal.interface';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { WithdrawalService } from './withdrawal.service';

describe('Withdrawal Service', () => {
  let apiServiceMock: ApiService;
  let withdrawalService: WithdrawalService;

  const withdrawalResponseData: WithdrawalData = {
    data: {
      uuid: 'abc-123',
      orderDocumentNumber: 'PO-12345',
      orderEmail: 'customer@example.com',
      status: 'INITIAL',
    },
  };

  const withdrawalSentResponseData: WithdrawalData = {
    data: {
      uuid: 'abc-123',
      orderDocumentNumber: 'PO-12345',
      orderEmail: 'customer@example.com',
      confirmationEmail: 'confirmation@example.com',
      name: 'John Doe',
      status: 'CREATED',
    },
  };

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    when(apiServiceMock.encodeResourceId(anything())).thenCall(id => id);

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    withdrawalService = TestBed.inject(WithdrawalService);
  });

  it('should be created', () => {
    expect(withdrawalService).toBeTruthy();
  });

  describe('createWithdrawal', () => {
    it("should call the API and map the response when 'createWithdrawal' is called with a real order number", done => {
      const data: Withdrawal = { orderDocumentNumber: 'PO-12345', orderEmail: 'customer@example.com' };
      when(apiServiceMock.post(anything(), anything(), anything())).thenReturn(of(withdrawalResponseData));

      withdrawalService.createWithdrawal(data).subscribe(result => {
        verify(apiServiceMock.post('withdrawals', anything(), anything())).once();
        expect(capture(apiServiceMock.post).last()[0]).toMatchInlineSnapshot(`"withdrawals"`);
        expect(result.id).toEqual('abc-123');
        expect(result.orderDocumentNumber).toEqual('PO-12345');
        expect(result.orderEmail).toEqual('customer@example.com');
        expect(result.status).toEqual('INITIAL');
        done();
      });
    });

    it('should include orderDocumentNumber and orderEmail as query params', done => {
      const data: Withdrawal = { orderDocumentNumber: 'PO-12345', orderEmail: 'customer@example.com' };
      when(apiServiceMock.post(anything(), anything(), anything())).thenReturn(of(withdrawalResponseData));

      withdrawalService.createWithdrawal(data).subscribe(() => {
        const [, , options] = capture(apiServiceMock.post).last();
        expect((options as { params: { get(key: string): string } }).params.get('orderDocumentNumber')).toEqual(
          'PO-12345'
        );
        expect((options as { params: { get(key: string): string } }).params.get('orderEmail')).toEqual(
          'customer@example.com'
        );
        done();
      });
    });
  });

  describe('sendWithdrawalRequest', () => {
    it("should call the API and map the response when 'sendWithdrawalRequest' is called with a real withdrawal", done => {
      const withdrawal: Withdrawal = {
        orderDocumentNumber: 'PO-12345',
        orderEmail: 'customer@example.com',
        id: 'abc-123',
        name: 'John Doe',
        confirmationEmail: 'confirmation@example.com',
      };
      when(apiServiceMock.patch(anything(), anything(), anything())).thenReturn(of(withdrawalSentResponseData));

      withdrawalService.sendWithdrawalRequest(withdrawal).subscribe(result => {
        verify(apiServiceMock.patch('withdrawals/abc-123', anything(), anything())).once();
        expect(capture(apiServiceMock.patch).last()[0]).toMatchInlineSnapshot(`"withdrawals/abc-123"`);
        expect(result.id).toEqual('abc-123');
        expect(result.status).toEqual('CREATED');
        expect(result.confirmationEmail).toEqual('confirmation@example.com');
        expect(result.name).toEqual('John Doe');
        done();
      });
    });

    it('should encode the withdrawal id in the API endpoint', done => {
      const withdrawal: Withdrawal = {
        orderDocumentNumber: 'PO-12345',
        orderEmail: 'customer@example.com',
        id: 'special/id',
      };
      when(apiServiceMock.encodeResourceId(anything())).thenCall(id => encodeURIComponent(id));
      when(apiServiceMock.patch(anything(), anything(), anything())).thenReturn(of(withdrawalSentResponseData));

      withdrawalService.sendWithdrawalRequest(withdrawal).subscribe(() => {
        expect(capture(apiServiceMock.patch).last()[0]).toEqual(`withdrawals/${encodeURIComponent('special/id')}`);
        done();
      });
    });
  });
});
