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
    if (this.rejectForm.valid) {
      this.submitRejectRequisition.emit(this.rejectForm.get('comment').value);
      this.hide();
    }
  }

  /** Opens the modal. */
  show() {
    this.rejectForm.reset();
    this.modal = this.ngbModal.open(this.modalTemplate, { ariaLabelledBy: 'requisition-reject-modal-title' });
  }

  /** Close the modal. */
  hide() {
    if (this.modal) {
      this.modal.close();
    }
  }
}
