import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrderTemplate } from '../../models/order-template/order-template.model';

/**
 * The Order Templates Preferences Dialog shows the modal to create/edit a order template.
 *
 * @example
 * <ish-order-template-preferences-dialog
    (submit)="createOrderTemplate($event)">
   </ish-order-template-preferences-dialog>
 */
@Component({
  selector: 'ish-order-template-preferences-dialog',
  templateUrl: './order-template-preferences-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTemplatePreferencesDialogComponent implements OnInit {
  /**
   * Predefined order template to fill the form with, if there is no order template a new order template will be created
   */
  @Input() orderTemplate: OrderTemplate;

  @Input() modalTitle?: string;
  /**
   * Emits the data of the new order template to create.
   */
  @Output() submit = new EventEmitter<OrderTemplate>();

  orderTemplateForm = new FormGroup({});
  model: Partial<OrderTemplate>;
  fields: FormlyFieldConfig[];
  submitted = false;

  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  /** localization keys, default = for new */
  primaryButton = 'account.order_template.new_from_order.button.create.label';
  orderTemplateTitle = 'account.order_template.new_order_template.text';
  modalHeader = 'account.order_template.list.button.add_template.label';

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal) {}

  ngOnInit() {
    this.fields = [
      {
        key: 'title',
        type: 'ish-text-input-field',
        templateOptions: {
          required: true,
          label: 'account.order_template.form.name.label',
          hideRequiredMarker: true,
          maxLength: 35,
        },
        validation: {
          messages: {
            required: 'account.order_template.form.name.error.required',
          },
        },
      },
    ];

    this.model = pick(this.orderTemplate, 'title');

    if (this.orderTemplate) {
      this.primaryButton = 'account.order_templates.edit_form.save_button.text';
      this.orderTemplateTitle = this.orderTemplate.title;
      this.modalHeader = 'account.order_template.edit.heading';
    }
  }

  /** Emits the order template data, when the form was valid. */
  submitOrderTemplateForm() {
    if (this.orderTemplateForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.orderTemplateForm);
      return;
    }

    this.submit.emit({
      id: !this.orderTemplate ? this.model.title : this.orderTemplateTitle,
      title: this.model.title,
    });

    this.hide();
  }

  /** Opens the modal. */
  show() {
    if (this.orderTemplate) {
      this.model = pick(this.orderTemplate, 'title');
    }
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /** Close the modal. */
  hide() {
    this.orderTemplateForm.reset({});
    this.submitted = false;
    if (this.modal) {
      this.modal.close();
    }
  }

  get formDisabled() {
    return this.orderTemplateForm.invalid && this.submitted;
  }
}
