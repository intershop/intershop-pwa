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
    id: 'abc-123',
    data: {
      orderDocumentNumber: 'PO-12345',
      orderEmail: 'customer@example.com',
      status: 'INITIAL',
    },
  };

  const withdrawalSentResponseData: WithdrawalData = {
    id: 'abc-123',
    data: {
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
    it("should call the API and map the response when 'createWithdrawal' is called with valid data", done => {
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

    it('should pass the withdrawal data as request body', done => {
      const data: Withdrawal = { orderDocumentNumber: 'PO-12345', orderEmail: 'customer@example.com' };
      when(apiServiceMock.post(anything(), anything(), anything())).thenReturn(of(withdrawalResponseData));

      withdrawalService.createWithdrawal(data).subscribe(() => {
        const [, body] = capture(apiServiceMock.post).last();
        expect(body).toMatchObject({ orderDocumentNumber: 'PO-12345', orderEmail: 'customer@example.com' });
        done();
      });
    });

    it('should throw an error when orderDocumentNumber is missing', done => {
      const data: Withdrawal = { orderDocumentNumber: undefined, orderEmail: 'customer@example.com' };

      withdrawalService.createWithdrawal(data).subscribe({
        error: (err: Error) => {
          expect(err.message).toEqual('createWithdrawal() called with missing required data');
          done();
        },
      });
    });

    it('should throw an error when orderEmail is missing', done => {
      const data: Withdrawal = { orderDocumentNumber: 'PO-12345', orderEmail: undefined };

      withdrawalService.createWithdrawal(data).subscribe({
        error: (err: Error) => {
          expect(err.message).toEqual('createWithdrawal() called with missing required data');
          done();
        },
      });
    });

    it('should save result to sessionStorage on success', done => {
      const data: Withdrawal = { orderDocumentNumber: 'PO-12345', orderEmail: 'customer@example.com' };
      when(apiServiceMock.post(anything(), anything(), anything())).thenReturn(of(withdrawalResponseData));

      withdrawalService.createWithdrawal(data).subscribe(() => {
        expect(sessionStorage.getItem('withdrawal')).toContain('abc-123');
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

    it('should throw an error when withdrawal id is missing', done => {
      const withdrawal: Withdrawal = {
        orderDocumentNumber: 'PO-12345',
        orderEmail: 'customer@example.com',
        id: undefined,
      };

      withdrawalService.sendWithdrawalRequest(withdrawal).subscribe({
        error: (err: Error) => {
          expect(err.message).toEqual('sendWithdrawalRequest() called without required withdrawal id');
          done();
        },
      });
    });

    it('should save result to sessionStorage on success', done => {
      const withdrawal: Withdrawal = {
        orderDocumentNumber: 'PO-12345',
        orderEmail: 'customer@example.com',
        id: 'abc-123',
        name: 'John Doe',
        confirmationEmail: 'confirmation@example.com',
      };
      when(apiServiceMock.patch(anything(), anything(), anything())).thenReturn(of(withdrawalSentResponseData));

      withdrawalService.sendWithdrawalRequest(withdrawal).subscribe(() => {
        expect(sessionStorage.getItem('withdrawal')).toContain('abc-123');
        done();
      });
    });
  });
});
