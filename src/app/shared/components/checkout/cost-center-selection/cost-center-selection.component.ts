import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { whenTruthy } from 'ish-core/utils/operators';

// nur für BusinessCustomer anzeigen
@Component({
  selector: 'ish-cost-center-selection',
  templateUrl: './cost-center-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterSelectionComponent implements OnInit, OnDestroy {
  costCenters$: Observable<CostCenter[]>;

  costCenterSelectForm = new FormGroup({});
  fields: FormlyFieldConfig[];
  model = { costCenter: '' };
  showSelection = true;

  private selectionRole = 'Buyer';

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.costCenters$ = this.checkoutFacade.getCostCenters$();
    this.fields = this.getFields();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getOptions(): Observable<{ label: string; value: string }[]> {
    return this.costCenters$.pipe(
      whenTruthy(),
      map(costCenters =>
        costCenters
          .filter(costCenter => costCenter.roles.find(r => r === this.selectionRole))
          .map(c => ({
            label: c.name,
            value: c.id,
          }))
      ),
      tap(selectOptions => {
        switch (selectOptions.length) {
          case 0:
            this.showSelection = false;
            break;
          case 1:
            this.costCenterSelectForm.get('costCenter').setValue(selectOptions[0].value);
            this.fields[0].templateOptions.placeholder = undefined;
            break;
        }
      })
    );
  }

  private submit(costCenterId: string) {
    console.log(costCenterId);
    // this.checkoutFacade.assignCostCenterId(costCenterId);
  }

  private getFields(): FormlyFieldConfig[] {
    return [
      {
        key: 'costCenter',
        type: 'ish-select-field',
        templateOptions: {
          // fieldClass: 'col-12',
          label: 'checkout.cost_center.select.label',
          options: this.getOptions(),
          placeholder: 'account.option.select.text',
        },
        hooks: {
          onInit: field => {
            field.form
              .get('costCenter')
              .valueChanges.pipe(whenTruthy(), takeUntil(this.destroy$))
              .subscribe(costCenterId => {
                this.submit(costCenterId);
              });
          },
        },
      },
    ];
  }
}
