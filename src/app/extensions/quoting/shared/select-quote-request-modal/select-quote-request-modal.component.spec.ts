import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuotingEntity } from '../../models/quoting/quoting.model';

import { SelectQuoteRequestModalComponent } from './select-quote-request-modal.component';

describe('Select Quote Request Modal Component', () => {
  let component: SelectQuoteRequestModalComponent;
  let fixture: ComponentFixture<SelectQuoteRequestModalComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;
  let ngbModal: NgbModal;
  let modalRef: NgbModalRef;

  beforeEach(async () => {
    quotingFacade = mock(QuotingFacade);
    ngbModal = mock(NgbModal);
    modalRef = mock(NgbModalRef);

    await TestBed.configureTestingModule({
      declarations: [SelectQuoteRequestModalComponent],
      imports: [FormlyTestingModule, TranslatePipe],
      providers: [
        { provide: NgbModal, useFactory: () => instance(ngbModal) },
        { provide: QuotingFacade, useFactory: () => instance(quotingFacade) },
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    when(quotingFacade.newQuoteRequests$).thenReturn(of([] as QuotingEntity[]));
    when(ngbModal.open(anything(), anything())).thenReturn(instance(modalRef));
    when(modalRef.componentInstance).thenReturn({});

    fixture = TestBed.createComponent(SelectQuoteRequestModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.sku = 'SKU';
    component.quantity = 2;
    component.modalRef = instance(modalRef);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('submitForm', () => {
    it('should dispatch addProductToQuoteRequest with displayName when creating a new quote request', () => {
      fixture.detectChanges();
      component.formGroup.patchValue({ quoteRequest: 'new', newQuoteRequest: 'My Quote' });

      component.submitForm();

      verify(quotingFacade.addProductToQuoteRequest(anything())).once();
      const [payload] = capture(quotingFacade.addProductToQuoteRequest).last();
      expect(payload).toEqual({ sku: 'SKU', quantity: 2, displayName: 'My Quote', createNew: true });
      verify(modalRef.close()).once();
      verify(ngbModal.open(anything(), anything())).once();
    });

    it('should dispatch addProductToQuoteRequest with quoteRequestId when selecting an existing quote request', () => {
      when(quotingFacade.newQuoteRequests$).thenReturn(
        of([{ id: 'qrId', type: 'QuoteRequest', completenessLevel: 'List', creationDate: 1 }] as QuotingEntity[])
      );
      fixture.detectChanges();
      component.formGroup.patchValue({ quoteRequest: 'qrId', newQuoteRequest: '' });

      component.submitForm();

      verify(quotingFacade.addProductToQuoteRequest(anything())).once();
      const [payload] = capture(quotingFacade.addProductToQuoteRequest).last();
      expect(payload).toEqual({ sku: 'SKU', quantity: 2, quoteRequestId: 'qrId' });
      verify(modalRef.close()).once();
      verify(ngbModal.open(anything(), anything())).once();
    });

    it('should not dispatch when form is invalid', () => {
      fixture.detectChanges();
      component.formGroup.patchValue({ quoteRequest: 'new', newQuoteRequest: '' });
      component.formGroup.controls.newQuoteRequest.setErrors({ required: true });

      component.submitForm();

      verify(quotingFacade.addProductToQuoteRequest(anything())).never();
      verify(modalRef.close()).never();
    });
  });

  describe('hide', () => {
    it('should dismiss the modal', () => {
      component.hide();
      verify(modalRef.dismiss()).once();
    });
  });
});
