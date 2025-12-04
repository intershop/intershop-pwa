import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, map, tap } from 'rxjs';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';
import { ProductContextAccessDirective } from 'ish-core/directives/product-context-access.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { ProductReviewsFacade } from '../../facades/product-reviews.facade';
import { ProductReview } from '../../models/product-reviews/product-review.model';

@Component({
  selector: 'ish-product-review-create-dialog',
  imports: [
    AsyncPipe,
    FormlyForm,
    FormSubmitDirective,
    ModalDialogComponent,
    ProductContextAccessDirective,
    ProductIdComponent,
    ProductImageComponent,
    ProductNameComponent,
    ProductVariationDisplayComponent,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './product-review-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReviewCreateDialogComponent implements OnInit {
  @ViewChild('modal') modalDialog: ModalDialogComponent<unknown>;

  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[];
  model$: Observable<Partial<ProductReview>>;

  constructor(
    private accountFacade: AccountFacade,
    private reviewFacade: ProductReviewsFacade
  ) {}

  ngOnInit() {
    this.model$ = this.accountFacade.user$.pipe(
      tap(user => {
        if (!user && this.modalDialog) {
          this.modalDialog.hide();
        }
      }),
      map(user => ({ authorFirstName: `${user.firstName} ${user.lastName.charAt(0)}.` }))
    );

    this.fields = [
      {
        key: 'authorFirstName',
        type: 'ish-plain-text-field',
        props: {
          label: 'product.review.name.label',
          labelClass: 'col-md-3',
          fieldClass: 'col-md-9',
        },
      },
      {
        key: 'rating',
        type: 'ish-rating-stars-field',
        props: {
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
        props: {
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
        props: {
          label: 'product.review.content.label',
          labelClass: 'col-md-3',
          fieldClass: 'col-md-9',
          required: true,
          rows: 5,
          placeholder: 'product.review.content.placeholder',
          maxLength: 4000,
          maxLengthDescription: 'product.review.content.max_limit',
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
    this.modalDialog.show();
  }

  /** Send the review to the server */
  submitForm(sku: string) {
    if (this.form.valid) {
      this.reviewFacade.createProductReview(sku, this.form.value);
      this.modalDialog.hide();
    }
  }
}
