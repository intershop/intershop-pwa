import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Wishlist Reject Approval Dialog shows the modal to reject a requisition.
 *
 * @example
 * <ish-requisition-reject-dialog
    (submitRejectRequisition)="rejectRequisition($event)">
   </ish-requisition-reject-dialog>
 */
@Component({
  selector: 'ish-requisition-reject-dialog',
  templateUrl: './requisition-reject-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisitionRejectDialogComponent implements OnInit {
  /**
   * Emits the reject event with the reject comment.
   */
  @Output() submitRejectRequisition = new EventEmitter<string>();

  rejectForm = new FormGroup({});
  private submitted = false;
  fields: FormlyFieldConfig[];

  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  @ViewChild('modal') modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.fields = [
      {
        key: 'comment',
        type: 'ish-textarea-field',
        props: {
          label: 'approval.rejectform.add_a_comment.label',
          required: true,
          maxLength: 1000,
          rows: 4,
          labelClass: 'col-12',
          fieldClass: 'col-12',
          hideRequiredMarker: true,
        },
        validation: {
          messages: {
            required: 'approval.rejectform.invalid_comment.error',
          },
        },
      },
    ];
  }

  /** Emits the reject comment data, when the form was valid. */
  submitForm() {
    if (this.rejectForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.rejectForm);
      focusFirstInvalidField(this.rejectForm);
      return;
    }

    this.submitRejectRequisition.emit(this.rejectForm.get('comment').value);
    this.hide();
  }

  /** Opens the modal. */
  show() {
    this.rejectForm.reset();
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /** Close the modal. */
  hide() {
    this.submitted = false;
    if (this.modal) {
      this.modal.close();
    }
  }

  get formDisabled() {
    return this.rejectForm.invalid && this.submitted;
  }
}
