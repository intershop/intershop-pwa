import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { SelectQuoteRequestModalComponent } from '../shared/select-quote-request-modal/select-quote-request-modal.component';

import { productAddToQuoteRequestGuard } from './product-add-to-quote-request.guard';

describe('Product Add To Quote Request Guard', () => {
  let ngbModal: NgbModal;
  let modalRef: NgbModalRef;
  let component: SelectQuoteRequestModalComponent;

  function createRoute(queryParams: Record<string, string>): ActivatedRouteSnapshot {
    return { queryParamMap: convertToParamMap(queryParams) } as ActivatedRouteSnapshot;
  }

  function runGuard(route: ActivatedRouteSnapshot): boolean {
    return TestBed.runInInjectionContext(() => productAddToQuoteRequestGuard(route));
  }

  beforeEach(() => {
    ngbModal = mock(NgbModal);
    modalRef = mock(NgbModalRef);
    component = {} as SelectQuoteRequestModalComponent;

    when(modalRef.componentInstance).thenReturn(component);
    when(ngbModal.open(anything(), anything())).thenReturn(instance(modalRef));

    TestBed.configureTestingModule({
      providers: [{ provide: NgbModal, useFactory: () => instance(ngbModal) }],
    });
  });

  it('should open the selection modal and pass sku and quantity when query params are valid', () => {
    const result = runGuard(createRoute({ sku: '201807231', quantity: '2' }));

    expect(result).toBeFalse();
    verify(ngbModal.open(SelectQuoteRequestModalComponent, anything())).once();
    expect(component.sku).toEqual('201807231');
    expect(component.quantity).toBe(2);
    expect(component.modalRef).toBe(instance(modalRef));
  });

  it('should trim the sku query param before passing it to the modal', () => {
    const result = runGuard(createRoute({ sku: '  201807231  ', quantity: '2' }));

    expect(result).toBeFalse();
    verify(ngbModal.open(SelectQuoteRequestModalComponent, anything())).once();
    expect(component.sku).toEqual('201807231');
  });

  it('should not open the modal when sku query param is missing', () => {
    const result = runGuard(createRoute({ quantity: '2' }));

    expect(result).toBeFalse();
    verify(ngbModal.open(anything(), anything())).never();
  });

  it('should not open the modal when sku query param is empty', () => {
    const result = runGuard(createRoute({ sku: '', quantity: '2' }));

    expect(result).toBeFalse();
    verify(ngbModal.open(anything(), anything())).never();
  });

  it('should not open the modal when sku query param is whitespace only', () => {
    const result = runGuard(createRoute({ sku: '   ', quantity: '2' }));

    expect(result).toBeFalse();
    verify(ngbModal.open(anything(), anything())).never();
  });

  it('should default quantity to 1 when quantity query param is missing', () => {
    const result = runGuard(createRoute({ sku: '201807231' }));

    expect(result).toBeFalse();
    verify(ngbModal.open(SelectQuoteRequestModalComponent, anything())).once();
    expect(component.quantity).toBe(1);
  });

  it('should default quantity to 1 when quantity query param is not a number', () => {
    const result = runGuard(createRoute({ sku: '201807231', quantity: 'abc' }));

    expect(result).toBeFalse();
    verify(ngbModal.open(SelectQuoteRequestModalComponent, anything())).once();
    expect(component.quantity).toBe(1);
  });

  it('should default quantity to 1 when quantity query param is zero', () => {
    const result = runGuard(createRoute({ sku: '201807231', quantity: '0' }));

    expect(result).toBeFalse();
    verify(ngbModal.open(SelectQuoteRequestModalComponent, anything())).once();
    expect(component.quantity).toBe(1);
  });

  it('should default quantity to 1 when quantity query param is negative', () => {
    const result = runGuard(createRoute({ sku: '201807231', quantity: '-1' }));

    expect(result).toBeFalse();
    verify(ngbModal.open(SelectQuoteRequestModalComponent, anything())).once();
    expect(component.quantity).toBe(1);
  });
});
