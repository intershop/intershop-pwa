import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { QuotingEntity } from '../../models/quoting/quoting.model';
import { ProductAddToQuoteDialogComponent } from '../product-add-to-quote-dialog/product-add-to-quote-dialog.component';

/**
 * The quote request select modal allows the user to choose an existing
 * quote request or create a new one before adding the product to a quote request.
 * If the new quote request name is left empty (optional), a new quote request
 * is created using the ID as the name.
 */
@Component({
  selector: 'ish-select-quote-request-modal',
  templateUrl: './select-quote-request-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectQuoteRequestModalComponent implements OnInit {
  @Input({ required: true }) sku: string;
  @Input() quantity = 1;
  // not-dead-code
  modalRef: NgbModalRef;

  fieldConfig$: Observable<FormlyFieldConfig[]>;

  formGroup = new FormGroup<{ quoteRequest?: FormControl<string>; newQuoteRequest?: FormControl<string> }>({});

  private destroyRef = inject(DestroyRef);

  constructor(
    private quotingFacade: QuotingFacade,
    private ngbModal: NgbModal
  ) {}

  ngOnInit() {
    this.fieldConfig$ = this.quotingFacade.newQuoteRequests$.pipe(
      map(quoteRequests => this.buildFieldConfig(quoteRequests))
    );
  }

  private buildFieldConfig(quoteRequests: QuotingEntity[]): FormlyFieldConfig[] {
    const newQuoteRequestInput: FormlyFieldConfig = {
      type: 'ish-text-input-field',
      key: 'newQuoteRequest',
      props: {
        placeholder: 'quote.select_quote_request.modal.new_quote_request.name.placeholder',
        ariaLabel: 'quote.select_quote_request.modal.new_quote_request.name.placeholder',
      },
      validators: {
        validation: [SpecialValidators.noHtmlTags],
      },
      validation: {
        messages: {
          noHtmlTags: 'account.name.error.forbidden.html.chars',
        },
      },
    };

    // no existing quote requests: show only the name input, no radio selection needed
    if (quoteRequests.length === 0) {
      return [newQuoteRequestInput];
    }

    const radioOptions: FormlyFieldConfig[] = quoteRequests.map(entity => ({
      type: 'ish-radio-field',
      key: 'quoteRequest',
      defaultValue: quoteRequests[0]?.id,
      props: {
        fieldClass: ' ',
        value: entity.id,
        label: QuotingHelper.isNotStub(entity) ? entity.displayName || entity.number : entity.id,
      },
    }));

    const newRequestGroup: FormlyFieldConfig = {
      fieldGroupClassName: 'form-check d-flex',
      fieldGroup: [
        {
          type: 'ish-radio-field',
          key: 'quoteRequest',
          props: {
            inputClass: 'position-static',
            fieldClass: ' ',
            value: 'new',
            ariaLabel: 'quote.select_quote_request.modal.new_quote_request.option.label',
          },
        },
        {
          ...newQuoteRequestInput,
          className: 'w-75 position-relative validation-offset-0',
          wrappers: ['validation'],
          hooks: {
            onInit: (field: FormlyFieldConfig) => {
              field.form
                .get('quoteRequest')
                ?.valueChanges.pipe(
                  filter(value => value === 'new'),
                  debounceTime(0),
                  takeUntilDestroyed(this.destroyRef)
                )
                .subscribe(() => {
                  field.focus = true;
                });
            },
          },
          props: {
            ...newQuoteRequestInput.props,
            focus: (field: FormlyFieldConfig) => {
              field.form.get('quoteRequest')?.setValue('new');
            },
          },
        },
      ],
    };

    return [...radioOptions, newRequestGroup];
  }

  submitForm() {
    if (this.formGroup.invalid) {
      return;
    }
    const { quoteRequest, newQuoteRequest } = this.formGroup.value;
    const isNew = !quoteRequest || quoteRequest === 'new';
    this.quotingFacade.addProductToQuoteRequest({
      sku: this.sku,
      quantity: this.quantity,
      ...(isNew
        ? { displayName: newQuoteRequest?.trim() || undefined, createNew: true }
        : { quoteRequestId: quoteRequest }),
    });
    this.modalRef.close();
    const ref = this.ngbModal.open(ProductAddToQuoteDialogComponent, {
      size: 'lg',
      scrollable: true,
      ariaLabelledBy: 'product-add-to-quote-modal-title',
    });
    (ref.componentInstance as ProductAddToQuoteDialogComponent).modalRef = ref;
  }

  hide() {
    this.modalRef.dismiss();
  }
}
