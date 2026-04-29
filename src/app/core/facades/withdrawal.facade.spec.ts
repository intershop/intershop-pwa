import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';
import { WithdrawalService } from 'ish-core/services/withdrawal/withdrawal.service';

import { WithdrawalFacade } from './withdrawal.facade';

describe('Withdrawal Facade', () => {
  let facade: WithdrawalFacade;
  let withdrawalService: WithdrawalService;

  const mockWithdrawal: Withdrawal = {
    id: 'w1',
    orderDocumentNumber: 'ORDER-123',
    orderEmail: 'test@example.com',
    status: 'INITIAL',
  };

  beforeEach(() => {
    withdrawalService = mock(WithdrawalService);

    TestBed.configureTestingModule({
      providers: [{ provide: WithdrawalService, useFactory: () => instance(withdrawalService) }, WithdrawalFacade],
    });

    facade = TestBed.inject(WithdrawalFacade);
  });

  afterEach(() => {
    localStorage.removeItem('withdrawal');
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have undefined withdrawal', () => {
      expect(facade.withdrawal()).toBeUndefined();
    });

    it('should have loading false', () => {
      expect(facade.loading()).toBeFalse();
    });

    it('should have undefined error', () => {
      expect(facade.error()).toBeUndefined();
    });
  });

  describe('getWithdrawalFromLocalStorage()', () => {
    it('should set withdrawal signal when localStorage entry exists', () => {
      localStorage.setItem('withdrawal', JSON.stringify(mockWithdrawal));

      facade.getWithdrawalFromLocalStorage();

      expect(facade.withdrawal()).toEqual(mockWithdrawal);
    });

    it('should not update withdrawal signal when localStorage has no entry', () => {
      localStorage.removeItem('withdrawal');

      facade.getWithdrawalFromLocalStorage();

      expect(facade.withdrawal()).toBeUndefined();
    });
  });

  describe('createWithdrawal()', () => {
    it('should set loading to true then false on success', () => {
      when(withdrawalService.createWithdrawal(anything())).thenReturn(of(mockWithdrawal));

      facade.createWithdrawal('ORDER-123', 'test@example.com');

      expect(facade.loading()).toBeFalse();
    });

    it('should set withdrawal signal on success', () => {
      when(withdrawalService.createWithdrawal(anything())).thenReturn(of(mockWithdrawal));

      facade.createWithdrawal('ORDER-123', 'test@example.com');

      expect(facade.withdrawal()).toEqual(mockWithdrawal);
    });

    it('should save result to localStorage on success', () => {
      when(withdrawalService.createWithdrawal(anything())).thenReturn(of(mockWithdrawal));

      facade.createWithdrawal('ORDER-123', 'test@example.com');

      expect(localStorage.getItem('withdrawal')).toEqual(JSON.stringify(mockWithdrawal));
    });

    it('should clear error signal before calling service', () => {
      const error = { status: 404 } as HttpError;
      when(withdrawalService.createWithdrawal(anything()))
        .thenReturn(throwError(() => error))
        .thenReturn(of(mockWithdrawal));

      facade.createWithdrawal('ORDER-123', 'test@example.com');
      expect(facade.error()).toEqual(error);

      facade.createWithdrawal('ORDER-123', 'test@example.com');
      expect(facade.error()).toBeUndefined();
    });

    it('should set error signal on failure', () => {
      const error = { status: 404 } as HttpError;
      when(withdrawalService.createWithdrawal(anything())).thenReturn(throwError(() => error));

      facade.createWithdrawal('ORDER-123', 'test@example.com');

      expect(facade.error()).toEqual(error);
    });

    it('should set loading to false on failure', () => {
      when(withdrawalService.createWithdrawal(anything())).thenReturn(throwError(() => ({ status: 500 } as HttpError)));

      facade.createWithdrawal('ORDER-123', 'test@example.com');

      expect(facade.loading()).toBeFalse();
    });

    it('should call createWithdrawal with correct parameters', () => {
      when(withdrawalService.createWithdrawal(anything())).thenReturn(of(mockWithdrawal));

      facade.createWithdrawal('ORDER-123', 'test@example.com');

      verify(withdrawalService.createWithdrawal(anything())).once();
      const [arg] = capture(withdrawalService.createWithdrawal).last();
      expect(arg).toEqual({ orderDocumentNumber: 'ORDER-123', orderEmail: 'test@example.com' });
    });
  });

  describe('sendWithdrawal()', () => {
    const withdrawalRequest: Withdrawal = {
      ...mockWithdrawal,
      name: 'John Doe',
      confirmationEmail: 'test@example.com',
      status: 'CREATED',
    };

    it('should set withdrawal signal on success', () => {
      when(withdrawalService.sendWithdrawalRequest(anything())).thenReturn(of(withdrawalRequest));

      facade.sendWithdrawal(withdrawalRequest);

      expect(facade.withdrawal()).toEqual(withdrawalRequest);
    });

    it('should save result to localStorage on success', () => {
      when(withdrawalService.sendWithdrawalRequest(anything())).thenReturn(of(withdrawalRequest));

      facade.sendWithdrawal(withdrawalRequest);

      expect(localStorage.getItem('withdrawal')).toEqual(JSON.stringify(withdrawalRequest));
    });

    it('should set loading to false on success', () => {
      when(withdrawalService.sendWithdrawalRequest(anything())).thenReturn(of(withdrawalRequest));

      facade.sendWithdrawal(withdrawalRequest);

      expect(facade.loading()).toBeFalse();
    });

    it('should set error signal on failure', () => {
      const error = { status: 422 } as HttpError;
      when(withdrawalService.sendWithdrawalRequest(anything())).thenReturn(throwError(() => error));

      facade.sendWithdrawal(withdrawalRequest);

      expect(facade.error()).toEqual(error);
    });

    it('should set loading to false on failure', () => {
      when(withdrawalService.sendWithdrawalRequest(anything())).thenReturn(
        throwError(() => ({ status: 500 } as HttpError))
      );

      facade.sendWithdrawal(withdrawalRequest);

      expect(facade.loading()).toBeFalse();
    });
  });

  describe('cleanup()', () => {
    it('should remove withdrawal from localStorage', () => {
      localStorage.setItem('withdrawal', JSON.stringify(mockWithdrawal));

      facade.cleanup();

      expect(localStorage.getItem('withdrawal')).toBeNull();
    });
  });
});
