import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, take } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate, OrderTemplateItem } from '../../models/order-template/order-template.model';
import { SelectOrderTemplateModalComponent } from '../../shared/select-order-template-modal/select-order-template-modal.component';

@Component({
  selector: 'ish-account-order-template-detail-page',
  standalone: false,
  templateUrl: './account-order-template-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateDetailPageComponent implements OnInit {
  orderTemplate$: Observable<OrderTemplate>;
  orderTemplateError$: Observable<HttpError>;
  orderTemplateLoading$: Observable<boolean>;

  noOfUnavailableProducts$: Observable<number>;

  form = new FormGroup({});
  model: { title: string };
  fields: FormlyFieldConfig[];

  @ViewChild('moveDialog') moveDialog: SelectOrderTemplateModalComponent;

  private currentOrderTemplate: OrderTemplate;
  moveItem: OrderTemplateItem;

  private destroyRef = inject(DestroyRef);

  constructor(private orderTemplatesFacade: OrderTemplatesFacade) {}

  ngOnInit() {
    this.orderTemplate$ = this.orderTemplatesFacade.currentOrderTemplate$;
    this.orderTemplateLoading$ = this.orderTemplatesFacade.orderTemplateLoading$;
    this.orderTemplateError$ = this.orderTemplatesFacade.orderTemplateError$;
    this.noOfUnavailableProducts$ = this.orderTemplatesFacade.currentOrderTemplateOutOfStockItems$.pipe(
      mapToProperty('length')
    );

    this.orderTemplate$.pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef)).subscribe(orderTemplate => {
      this.currentOrderTemplate = orderTemplate;
      this.moveItem = undefined;
      this.model = { title: orderTemplate.title };
      this.fields = this.getFields();
    });
  }

  private getFields(): FormlyFieldConfig[] {
    return [
      {
        key: 'title',
        type: 'ish-text-input-field',
        wrappers: ['validation'],
        props: {
          required: true,
          ariaLabel: 'account.order_template.edit.name.label',
          showValidation: () => false,
        },
        validation: {
          messages: {
            required: 'account.order_template.edit.name.error.required',
          },
        },
      },
    ];
  }

  updateTitle() {
    if (this.currentOrderTemplate && this.model.title && this.currentOrderTemplate.title !== this.model.title) {
      this.orderTemplatesFacade.updateOrderTemplate({
        ...this.currentOrderTemplate,
        title: this.model.title,
      });
    }
  }

  resetTitle() {
    this.orderTemplate$
      .pipe(whenTruthy(), take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(orderTemplate => (this.model = { ...this.model, title: orderTemplate.title }));
  }

  showMoveDialog(orderTemplateItemId: string) {
    this.moveItem = this.currentOrderTemplate.items.find(item => item.id === orderTemplateItemId);
    if (this.moveItem) {
      this.moveDialog.show();
    }
  }

  moveItemToOtherOrderTemplate(orderTemplateMoveData: { id: string; title: string }) {
    if (orderTemplateMoveData.id) {
      this.orderTemplatesFacade.moveItemToOrderTemplate(
        this.currentOrderTemplate.id,
        orderTemplateMoveData.id,
        this.moveItem.sku,
        this.moveItem.desiredQuantity.value
      );
    } else {
      this.orderTemplatesFacade.moveItemToNewOrderTemplate(
        this.currentOrderTemplate.id,
        orderTemplateMoveData.title,
        this.moveItem.sku,
        this.moveItem.desiredQuantity.value
      );
    }
  }
}
