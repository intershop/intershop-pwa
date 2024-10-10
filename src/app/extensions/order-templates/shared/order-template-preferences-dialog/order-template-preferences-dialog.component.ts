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
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';

import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { OrderTemplate } from '../../models/order-template/order-template.model';

/**
 * The Order Templates Preferences Dialog shows the modal to create/edit a order template.
 *
 * @example
 * <ish-order-template-preferences-dialog
    (submitOrderTemplate)="createOrderTemplate($event)">
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

  @Input() modalTitle: string;
  /**
   * Emits the data of the new order template to create.
   */
  @Output() submitOrderTemplate = new EventEmitter<OrderTemplate>();

  orderTemplateForm = new FormGroup({});
  model: Partial<OrderTemplate>;
  fields: FormlyFieldConfig[];
  private submitted = false;

  modalOptions: NgbModalOptions;

  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  /** localization keys, default = for new */
  primaryButton = 'account.order_template.new_from_order.button.create.label';
  private orderTemplateTitle = 'account.order_template.new_order_template.text';
  modalHeader = 'account.order_template.list.button.add_template.label';

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal) {}

  ngOnInit() {
    this.fields = [
      {
        key: 'title',
        type: 'ish-text-input-field',
        props: {
          required: true,
          label: 'account.order_template.form.name.label',
          hideRequiredMarker: true,
          maxLength: 35,
        },
        validators: {
          validation: [SpecialValidators.noHtmlTags],
        },
        validation: {
          messages: {
            required: 'account.order_template.form.name.error.required',
            noHtmlTags: 'account.name.error.forbidden.html.chars',
          },
        },
      },
    ];

    this.modalOptions = {
      ariaLabelledBy: 'order-template-preferences-title',
    };

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
      focusFirstInvalidField(this.orderTemplateForm);
      return;
    }

    this.submitOrderTemplate.emit({
      id: !this.orderTemplate ? this.model.title : this.orderTemplateTitle,
      title: this.model.title,
    });

    this.hide();
  }

  /** Opens the modal. */
  show() {
    this.orderTemplateForm.reset();
    this.model = pick(this.orderTemplate, 'title');
    this.modal = this.ngbModal.open(this.modalTemplate, this.modalOptions);
  }

  /** Close the modal. */
  hide() {
    this.submitted = false;
    if (this.modal) {
      this.modal.close();
    }
  }

  get formDisabled() {
    return this.orderTemplateForm.invalid && this.submitted;
  }
}
