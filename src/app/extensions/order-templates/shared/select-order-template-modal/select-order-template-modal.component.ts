import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject, of } from 'rxjs';
import { filter, map, startWith, take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

/**
 * The order template select modal displays a list of order templates. The user can select one order template  or enter a name for a new order template  in order to add or move an item to the selected order template .
 */
@Component({
  selector: 'ish-select-order-template-modal',
  templateUrl: './select-order-template-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOrderTemplateModalComponent implements OnInit, OnDestroy {
  /**
   * changes the some logic and the translations keys between add or move a product (default: 'add')
   */
  @Input() addMoveProduct: 'add' | 'move' = 'add';

  /**
   * submit success event
   */
  @Output() submitEmitter = new EventEmitter<{ id: string; title: string }>();

  orderTemplateOptions$: Observable<SelectOption[]>;

  formGroup: FormGroup = new FormGroup({});
  model: { orderTemplate?: string; newOrderTemplate?: string } = {};
  singleFieldConfig: FormlyFieldConfig[];
  multipleFieldConfig$: Observable<FormlyFieldConfig[]>;

  showForm: boolean;
  modal: NgbModalRef;

  private destroy$ = new Subject<void>();

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal, private orderTemplatesFacade: OrderTemplatesFacade) {}

  ngOnInit() {
    this.singleFieldConfig = [
      {
        type: 'ish-text-input-field',
        key: 'newOrderTemplate',
        templateOptions: {
          required: true,
          placeholder: 'account.order_template.new_order_template.text',
        },
        validation: {
          messages: { required: 'account.order_template.name.error.required' },
        },
      },
    ];

    this.orderTemplateOptions$ = this.orderTemplatesFacade.orderTemplates$.pipe(
      startWith([] as OrderTemplate[]),
      map(orderTemplates =>
        orderTemplates.map(orderTemplate => ({
          value: orderTemplate.id,
          label: orderTemplate.title,
        }))
      ),
      withLatestFrom(this.orderTemplatesFacade.currentOrderTemplate$),
      map(([orderTemplateOptions, currentOrderTemplate]) => {
        if (this.addMoveProduct === 'move' && currentOrderTemplate) {
          return orderTemplateOptions.filter(option => option.value !== currentOrderTemplate.id);
        }
        return orderTemplateOptions;
      })
    );

    this.multipleFieldConfig$ = this.orderTemplateOptions$.pipe(
      map(orderTemplateOptions =>
        orderTemplateOptions.map(option => ({
          type: 'ish-radio-field',
          key: 'orderTemplate',
          defaultValue: orderTemplateOptions[0].value,
          templateOptions: {
            fieldClass: ' ',
            value: option.value,
            label: option.label,
          },
        }))
      ),
      map(formlyConfig => [
        ...formlyConfig,
        {
          fieldGroupClassName: 'form-check d-flex',
          fieldGroup: [
            {
              type: 'ish-radio-field',
              key: 'orderTemplate',
              templateOptions: {
                fieldClass: ' ',
                value: 'new',
              },
            },
            {
              type: 'ish-text-input-field',
              key: 'newOrderTemplate',
              className: 'w-75 position-relative validation-offset-0',
              wrappers: ['validation'],
              templateOptions: {
                required: true,
                placeholder: 'account.order_template.name.error.required',
              },
              validation: {
                messages: { required: 'account.order_template.name.error.required' },
              },
              expressionProperties: {
                'templateOptions.disabled': model => model.orderTemplate !== 'new',
              },
            },
          ],
        },
      ])
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** emit results when the form is valid */
  submitForm() {
    const radioButtons = { ...this.model, ...this.formGroup.value };
    if (radioButtons?.orderTemplate && radioButtons.orderTemplate !== 'new') {
      if (this.formGroup.valid) {
        this.submitExisting(radioButtons.orderTemplate);
      } else {
        markAsDirtyRecursive(this.formGroup);
      }
    } else if (radioButtons.newOrderTemplate && this.formGroup.valid) {
      this.submitNew(radioButtons.newOrderTemplate);
    } else {
      markAsDirtyRecursive(this.formGroup);
    }
  }
  submitExisting(orderTemplateId: string) {
    this.orderTemplateOptions$
      .pipe(
        filter(options => options.length > 0),
        map(options => options.find(option => option.value === orderTemplateId).label),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(label => {
        this.submitEmitter.emit({
          id: orderTemplateId,
          title: label,
        });
        this.showForm = false;
      });
  }
  submitNew(newOrderTemplate: string) {
    this.submitEmitter.emit({
      id: undefined,
      title: newOrderTemplate,
    });
    this.showForm = false;
  }

  /** close modal */
  hide() {
    this.modal.close();
    this.formGroup.reset();
  }

  /** open modal */
  show() {
    this.showForm = true;
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  get selectedOrderTemplateTitle$(): Observable<string> {
    const selectedValue = this.formGroup.value.orderTemplate ?? this.model.orderTemplate;
    if (selectedValue === 'new' || !selectedValue) {
      return of(this.formGroup.value.newOrderTemplate);
    } else {
      return this.orderTemplateOptions$.pipe(
        filter(options => options.length > 0),
        map(options => options.find(opt => opt.value === selectedValue).label),
        take(1)
      );
    }
  }

  /** returns the route to the selected order template */
  get selectedOrderTemplateRoute$(): Observable<string> {
    const selectedValue = this.formGroup.value.orderTemplate ?? this.model.orderTemplate;

    if (selectedValue === 'new' || !selectedValue) {
      return this.orderTemplatesFacade.currentOrderTemplate$.pipe(
        map(
          currentOrderTemplate => `route://account/order-templates/${currentOrderTemplate && currentOrderTemplate.id}`
        ),
        take(1)
      );
    } else {
      return of(`route://account/order-templates/${selectedValue}`);
    }
  }

  /** translation key for the modal header */
  get headerTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'account.order_template.add_to_template.button.add_to_template.label'
      : 'account.order_template.table.options.move_to_template';
  }

  /** translation key for the submit button */
  get submitButtonTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'account.order_template.add_to_template.button.add_to_template.label'
      : 'account.order_template.table.options.move_to_template';
  }

  /** translation key for the success text */
  get successTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'account.order_template.added.confirmation'
      : 'account.order_template.move.added.text';
  }
}
