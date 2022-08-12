import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, map, tap } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { ProductReviewsFacade } from '../../facades/product-reviews.facade';
import { ProductReview } from '../../models/product-reviews/product-review.model';

@Component({
  selector: 'ish-product-review-create-dialog',
  templateUrl: './product-review-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReviewCreateDialogComponent implements OnInit {
  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  @ViewChild('modal') modalTemplate: TemplateRef<unknown>;

  form = new UntypedFormGroup({});
  submitted = false;
  fields: FormlyFieldConfig[];
  model$: Observable<Partial<ProductReview>>;

  constructor(
    private ngbModal: NgbModal,
    private accountFacade: AccountFacade,
    private reviewFacade: ProductReviewsFacade
  ) {}

  ngOnInit() {
    this.model$ = this.accountFacade.user$.pipe(
      tap(user => {
        if (!user) {
          this.hide();
        }
      }),
      map(user => ({ authorFirstName: `${user.firstName} ${user.lastName.charAt(0)}.` }))
    );

    this.fields = [
      {
        key: 'authorFirstName',
        type: 'ish-plain-text-field',
        templateOptions: {
          label: 'product.review.name.label',
          labelClass: 'col-md-3',
          fieldClass: 'col-md-9',
        },
      },
      {
        key: 'rating',
        type: 'ish-rating-stars-field',
        templateOptions: {
          label: 'product.review.rating.label',
          labelClass: 'col-md-3',
          fieldClass: 'col-md-9',
          required: true,
        },
        validation: {
          messages: {
            required: 'product.review.rating.error.required',
          },
        },
      },
      {
        key: 'title',
        type: 'ish-text-input-field',
        templateOptions: {
          label: 'product.review.title.label',
          labelClass: 'col-md-3',
          fieldClass: 'col-md-9',
          required: true,
        },
        validation: {
          messages: {
            required: 'product.review.title.error.required',
          },
        },
      },
      {
        key: 'content',
        type: 'ish-textarea-field',
        templateOptions: {
          label: 'product.review.content.label',
          labelClass: 'col-md-3',
          fieldClass: 'col-md-9',
          required: true,
          maxLength: 4000,
          rows: 5,
          placeholder: 'product.review.content.placeholder',
          customDescription: 'product.review.content.max_limit',
        },
        validation: {
          messages: {
            required: 'product.review.content.error.required',
          },
        },
      },
    ];
  }

  /** Opens the modal. */
  show() {
    this.form.reset();
    this.submitted = false;
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /** Close the modal. */
  hide() {
    if (this.modal) {
      this.modal.close();
    }
  }

  /** ToDo: send the review to the server */
  submitForm(sku: string) {
    if (this.form.invalid) {
      markAsDirtyRecursive(this.form);
      this.submitted = true;
      return;
    } else {
      this.reviewFacade.createProductReview(sku, this.form.value);
      this.hide();
    }
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
