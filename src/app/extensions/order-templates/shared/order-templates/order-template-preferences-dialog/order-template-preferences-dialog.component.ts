import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrderTemplate } from '../../../models/order-template/order-template.model';

@Component({
  selector: 'ish-order-template-preferences-dialog',
  templateUrl: './order-template-preferences-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Order Templates Preferences Dialog shows the modal to create/edit a order template.
 *
 * @example
 * <ish-order-template-preferences-dialog
    (submit)="createOrderTemplate($event)">
   </ish-order-template-preferences-dialog>
 */
export class OrderTemplatePreferencesDialogComponent implements OnChanges {
  /**
   * Predefined order template to fill the form with, if there is no order template a new order template will be created
   */
  @Input() orderTemplate: OrderTemplate;

  @Input() modalTitle?: string;
  /**
   * Emits the data of the new order template to create.
   */
  @Output() submit = new EventEmitter<OrderTemplate>();

  orderTemplateForm: FormGroup;
  submitted = false;

  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  // localization keys, default = for new
  primaryButton = 'account.order_template.new_from_order.button.create.label';
  orderTemplateTitle = 'account.order_template.new_order_template.text';
  modalHeader = 'account.order_template.list.button.add_template.label';

  // tslint:disable-next-line:no-any
  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<any>;

  constructor(private fb: FormBuilder, private ngbModal: NgbModal) {
    this.initForm();
  }

  ngOnChanges() {
    this.patchForm();
    this.modalHeader = this.modalTitle || this.modalHeader;
    if (this.orderTemplate) {
      this.primaryButton = 'account.order_templates.edit_form.save_button.text';
      this.orderTemplateTitle = this.orderTemplate.title;
      this.modalHeader = 'account.order_template.edit.heading';
    }
  }

  initForm() {
    this.orderTemplateForm = this.fb.group({ title: ['', [Validators.required, Validators.maxLength(35)]] });
  }

  patchForm() {
    if (this.orderTemplate) {
      this.orderTemplateForm.setValue({
        title: this.orderTemplate.title,
      });
    }
  }

  /** Emits the order template data, when the form was valid. */
  submitOrderTemplateForm() {
    if (this.orderTemplateForm.valid) {
      this.submit.emit({
        id: !this.orderTemplate ? this.orderTemplateForm.get('title').value : this.orderTemplateTitle,
        title: this.orderTemplateForm.get('title').value,
      });

      this.hide();
    } else {
      this.submitted = true;
      markAsDirtyRecursive(this.orderTemplateForm);
    }
  }

  /** Opens the modal. */
  show() {
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /** Close the modal. */
  hide() {
    this.orderTemplateForm.reset({
      title: '',
    });
    this.submitted = false;
    if (this.modal) {
      this.modal.close();
    }
  }

  get formDisabled() {
    return this.orderTemplateForm.invalid && this.submitted;
  }
}
