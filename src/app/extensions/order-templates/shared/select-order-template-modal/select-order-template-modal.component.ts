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
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, of } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';

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

  formGroup: FormGroup = new FormGroup({
    orderTemplate: new FormControl(''),
    newOrderTemplate: new FormControl(''),
  });
  singleFieldConfig: FormlyFieldConfig[];
  multipleFieldConfig$: Observable<FormlyFieldConfig[]>;

  showForm: boolean;
  modal: NgbModalRef;

  private destroy$ = new Subject<void>();

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(
    private ngbModal: NgbModal,
    private orderTemplatesFacade: OrderTemplatesFacade,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.orderTemplateOptions$ = this.orderTemplatesFacade.orderTemplatesSelectOptions$(this.addMoveProduct === 'move');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** emit results when the form is valid */
  submitForm() {
    const radioButtons = this.formGroup.value;
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

    // set default values after init (for example after closing and reopening the modal)
    this.orderTemplateOptions$
      .pipe(
        filter(opts => opts.length > 0),
        map(options => options[0]),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(option => {
        const defaultValue = this.translate.instant('account.order_template.new_order_template.text');
        this.formGroup.patchValue({ orderTemplate: option.value, newOrderTemplate: defaultValue });
      });
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
    const selectedValue = this.formGroup.value.orderTemplate;
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
    const selectedValue = this.formGroup.value.orderTemplate;

    if (selectedValue === 'new' || !selectedValue) {
      return this.orderTemplatesFacade.currentOrderTemplate$.pipe(
        map(currentOrderTemplate => `route://account/order-templates/${currentOrderTemplate?.id}`),
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
