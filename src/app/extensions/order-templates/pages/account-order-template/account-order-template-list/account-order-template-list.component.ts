import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, concatMap, filter, from, map, shareReplay, take } from 'rxjs';

import { SkuQuantityType } from 'ish-core/models/product/product.helper';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate } from '../../../models/order-template/order-template.model';

type OrderTemplateColumnsType = 'actions' | 'creationDate' | 'lineItems' | 'title';

@Component({
  selector: 'ish-account-order-template-list',
  standalone: false,
  templateUrl: './account-order-template-list.component.html',
  styleUrls: ['./account-order-template-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateListComponent {
  /**
   * The list of order templates of the customer.
   */
  private orderTemplateList: OrderTemplate[] = [];
  private requestedDetailIds = new Set<string>();
  private destroyRef = inject(DestroyRef);
  private cd = inject(ChangeDetectorRef);
  loadedDetailIds = new Set<string>();
  partsCache = new Map<string, Observable<SkuQuantityType[]>>();

  @Input() set orderTemplates(templates: OrderTemplate[]) {
    this.orderTemplateList = templates;
    const newTemplates = templates?.filter(t => t.itemsCount > 0 && !this.requestedDetailIds.has(t.id)) ?? [];
    newTemplates.forEach(t => {
      this.requestedDetailIds.add(t.id);
      this.partsCache.set(
        t.id,
        this.orderTemplatesFacade.orderTemplates$.pipe(
          map(all => all.find(ot => ot.id === t.id)),
          filter(ot => !!ot?.items),
          map(ot => ot.items.map(item => ({ sku: item.sku, quantity: item.desiredQuantity.value }))),
          shareReplay(1)
        )
      );
    });

    from(newTemplates)
      .pipe(
        concatMap(t => {
          this.orderTemplatesFacade.loadOrderTemplateDetails(t.id);
          return this.orderTemplatesFacade.orderTemplates$.pipe(
            filter(all => !!all.find(ot => ot.id === t.id)?.items),
            take(1)
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: all => {
          const loaded = all.find(ot => !this.loadedDetailIds.has(ot.id) && !!ot.items);
          if (loaded) {
            this.loadedDetailIds.add(loaded.id);
            this.cd.markForCheck();
          }
        },
      });
  }

  get orderTemplates(): OrderTemplate[] {
    return this.orderTemplateList;
  }

  @Input() columnsToDisplay: OrderTemplateColumnsType[] = ['title', 'creationDate', 'lineItems', 'actions'];

  /**
   * Holds the ID of the order template currently being added to cart
   */
  loadingOrderTemplateId$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(
    private orderTemplatesFacade: OrderTemplatesFacade,
    private translate: TranslateService
  ) {}

  /** Emits the id of the order template to delete. */
  delete(orderTemplateId: string) {
    this.orderTemplatesFacade.deleteOrderTemplate(orderTemplateId);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(orderTemplate: OrderTemplate, modal: ModalDialogComponent<string>) {
    modal.options.titleText = this.translate.instant('account.order_templates.delete_dialog.header', {
      0: orderTemplate.title,
    });
    modal.show(orderTemplate.id);
  }
}
