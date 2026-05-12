import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';
import { WithdrawalService } from 'ish-core/services/withdrawal/withdrawal.service';

import { WithdrawalFacade } from './withdrawal.facade';

describe('Withdrawal Facade', () => {
  let facade: WithdrawalFacade;
  let withdrawalService: WithdrawalService;
  let toastrService: ToastrService;

  const mockWithdrawal: Withdrawal = {
    id: 'w1',
    orderDocumentNumber: 'ORDER-123',
    orderEmail: 'test@example.com',
    status: 'INITIAL',
  };

  beforeEach(() => {
    withdrawalService = mock(WithdrawalService);
    toastrService = mock(ToastrService);

    TestBed.configureTestingModule({
      providers: [
        { provide: ToastrService, useFactory: () => instance(toastrService) },
        { provide: WithdrawalService, useFactory: () => instance(withdrawalService) },
        WithdrawalFacade,
      ],
    });

    facade = TestBed.inject(WithdrawalFacade);
  });

  afterEach(() => {
    sessionStorage.removeItem('withdrawal');
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

  describe('constructor', () => {
    it('should load withdrawal from sessionStorage on creation', () => {
      sessionStorage.setItem('withdrawal', JSON.stringify(mockWithdrawal));

      // Create a new facade instance to test constructor behavior
      const newFacade = new WithdrawalFacade(instance(withdrawalService), instance(toastrService));

      expect(newFacade.withdrawal()).toEqual(mockWithdrawal);
    });

    it('should have undefined withdrawal when sessionStorage has no entry', () => {
      sessionStorage.removeItem('withdrawal');

      const newFacade = new WithdrawalFacade(instance(withdrawalService), instance(toastrService));

      expect(newFacade.withdrawal()).toBeUndefined();
    });
  });

  describe('createWithdrawal()', () => {
    it('should set loading to true then false on success', () => {
      when(withdrawalService.createWithdrawal(anything())).thenReturn(of(mockWithdrawal));

      facade.createWithdrawal({ orderDocumentNumber: 'ORDER-123', orderEmail: 'test@example.com' });

      expect(facade.loading()).toBeFalse();
    });

    it('should set withdrawal signal on success', () => {
      when(withdrawalService.createWithdrawal(anything())).thenReturn(of(mockWithdrawal));

      facade.createWithdrawal({ orderDocumentNumber: 'ORDER-123', orderEmail: 'test@example.com' });

      expect(facade.withdrawal()).toEqual(mockWithdrawal);
    });

    it('should clear error signal before calling service', () => {
      const error = { status: 404, errors: [{ message: 'Not Found' }] } as HttpError;
      when(withdrawalService.createWithdrawal(anything()))
        .thenReturn(throwError(() => error))
        .thenReturn(of(mockWithdrawal));

      facade.createWithdrawal({ orderDocumentNumber: 'ORDER-123', orderEmail: 'test@example.com' });
      expect(facade.error()).toEqual(error);

      facade.createWithdrawal({ orderDocumentNumber: 'ORDER-123', orderEmail: 'test@example.com' });
      expect(facade.error()).toBeUndefined();
    });

    it('should set error signal on failure', () => {
      const error = { status: 404, errors: [{ message: 'Not Found' }] } as HttpError;
      when(withdrawalService.createWithdrawal(anything())).thenReturn(throwError(() => error));

      facade.createWithdrawal({ orderDocumentNumber: 'ORDER-123', orderEmail: 'test@example.com' });

      expect(facade.error()).toEqual(error);
    });

    it('should set loading to false on failure', () => {
      when(withdrawalService.createWithdrawal(anything())).thenReturn(throwError(() => ({ status: 500 }) as HttpError));

      facade.createWithdrawal({ orderDocumentNumber: 'ORDER-123', orderEmail: 'test@example.com' });

      expect(facade.loading()).toBeFalse();
    });

    it('should call createWithdrawal with correct parameters', () => {
      when(withdrawalService.createWithdrawal(anything())).thenReturn(of(mockWithdrawal));

      facade.createWithdrawal({ orderDocumentNumber: 'ORDER-123', orderEmail: 'test@example.com' });

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

    it('should set loading to false on success', () => {
      when(withdrawalService.sendWithdrawalRequest(anything())).thenReturn(of(withdrawalRequest));

      facade.sendWithdrawal(withdrawalRequest);

      expect(facade.loading()).toBeFalse();
    });

    it('should set error signal on failure', () => {
      const error = { status: 422, errors: [{ message: 'Unprocessable Entity' }] } as HttpError;
      when(withdrawalService.sendWithdrawalRequest(anything())).thenReturn(throwError(() => error));

      facade.sendWithdrawal(withdrawalRequest);

      expect(facade.error()).toEqual(error);
    });

    it('should set loading to false on failure', () => {
      when(withdrawalService.sendWithdrawalRequest(anything())).thenReturn(
        throwError(() => ({ status: 500 }) as HttpError)
      );

      facade.sendWithdrawal(withdrawalRequest);

      expect(facade.loading()).toBeFalse();
    });
  });

  describe('ngOnDestroy()', () => {
    it('should remove withdrawal from sessionStorage', () => {
      sessionStorage.setItem('withdrawal', JSON.stringify(mockWithdrawal));

      facade.ngOnDestroy();

      expect(sessionStorage.getItem('withdrawal')).toBeNull();
    });
  });
});
