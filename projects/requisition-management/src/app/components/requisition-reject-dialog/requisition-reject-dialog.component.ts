import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

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
  @Output() readonly submitRejectRequisition = new EventEmitter<string>();

  rejectForm = new FormGroup({});
  fields: FormlyFieldConfig[];

  @ViewChild('modal') modalDialog: ModalDialogComponent<unknown>;

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
    if (this.rejectForm.valid) {
      this.submitRejectRequisition.emit(this.rejectForm.get('comment').value);
      this.modalDialog.hide();
    }
  }

  /** Opens the modal. */
  show() {
    this.rejectForm.reset();
    this.modalDialog.show();
  }
}
