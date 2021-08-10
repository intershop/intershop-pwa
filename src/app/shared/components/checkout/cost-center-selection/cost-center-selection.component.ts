import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { log } from 'ish-core/utils/dev/operators';
import { whenTruthy } from 'ish-core/utils/operators';

// nur für BusinessCustomer anzeigen
@Component({
  selector: 'ish-cost-center-selection',
  templateUrl: './cost-center-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterSelectionComponent implements OnInit, OnDestroy {
  isBusinessCustomer: Observable<any>;
  costCenters$: Observable<CostCenter[]>;

  costCenterSelectForm = new FormGroup({});
  fields: FormlyFieldConfig[];
  placeholder: string;
  model = { costCenter: '' };
  showSelection = true;
  costCenterOptions$: Observable<{ label: string; value: string }[]>;

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.isBusinessCustomer = this.accountFacade.isBusinessCustomer$.pipe(
      whenTruthy(),
      take(1),
      tap(() => {
        this.costCenterOptions$ = this.checkoutFacade.eligibleCostCenterOptions$();
        this.costCenterOptions$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(options => {
          this.fields = this.getFields(options);
        });
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private submit(costCenterId: string) {
    console.log(costCenterId);
    // this.checkoutFacade.assignCostCenterId(costCenterId);
  }

  private getFields(options: { label: string; value: string }[]): FormlyFieldConfig[] {
    return [
      {
        key: 'costCenter',
        type: 'ish-select-field',
        templateOptions: {
          label: 'checkout.cost_center.select.label',
          options,
          placeholder: options.length > 1 ? 'account.option.select.text' : undefined,
        },
        hooks: {
          onInit: field => {
            if (options.length === 1 && options[0].value) {
              this.costCenterSelectForm.get('costCenter').setValue(options[0].value);
              this.submit(options[0].value);
            }
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
