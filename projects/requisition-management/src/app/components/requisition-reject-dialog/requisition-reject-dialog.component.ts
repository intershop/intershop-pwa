import { ChangeDetectionStrategy, Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Wishlist Reject Approval Dialog shows the modal to reject a requisition.
 *
 * @example
 * <ish-requisition-reject-dialog
    (submit)="rejectRequisition($event)">
   </ish-requisition-reject-dialog>
 */
@Component({
  selector: 'ish-requisition-reject-dialog',
  templateUrl: './requisition-reject-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisitionRejectDialogComponent {
  /**
   * Emits the reject event with the reject comment.
   */
  @Output() submit = new EventEmitter<string>();

  rejectForm: FormGroup;
  submitted = false;

  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  @ViewChild('modal') modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal) {
    this.initForm();
  }

  initForm() {
    this.rejectForm = new FormGroup({
      comment: new FormControl('', Validators.required),
    });
  }

  /** Emits the reject comment data, when the form was valid. */
  submitForm() {
    if (this.rejectForm.valid) {
      this.submit.emit(this.rejectForm.get('comment').value);

      this.hide();
    } else {
      this.submitted = true;
      markAsDirtyRecursive(this.rejectForm);
    }
  }

  /** Opens the modal. */
  show() {
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /** Close the modal. */
  hide() {
    this.rejectForm.reset({
      comment: '',
    });
    this.submitted = false;
    if (this.modal) {
      this.modal.close();
    }
  }

  get formDisabled() {
    return this.rejectForm.invalid && this.submitted;
  }
}
