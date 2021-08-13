import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { uniq } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * Section for Business Customer to Select a Cost Center on Checkout
 */
@Component({
  selector: 'ish-cost-center-selection',
  templateUrl: './cost-center-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterSelectionComponent implements OnInit, OnDestroy {
  isBusinessCustomer: Observable<boolean>;
  costCenters$: Observable<CostCenter[]>;

  costCenterSelectForm = new FormGroup({});
  fields: FormlyFieldConfig[];
  placeholder: string;
  model = { costCenter: '' };
  costCenterOptions$: Observable<{ label: string; value: string }[]>;

  private destroy$ = new Subject();

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isBusinessCustomer = this.accountFacade.isBusinessCustomer$.pipe(
      take(1),
      tap(isBusinessCustomer => {
        if (isBusinessCustomer) {
          this.costCenterOptions$ = this.checkoutFacade.eligibleCostCenterOptions$();
          this.costCenterOptions$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(options => {
            this.fields = this.getFields(options);
            this.setValidation();
          });
        }
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private submit(costCenterId: string) {
    this.checkoutFacade.setBasketCostCenter(costCenterId);
  }

  private setValidation() {
    this.checkoutFacade.basketValidationResults$.pipe(
      map(results =>
        uniq(
          results &&
            results.errors &&
            results.errors.map(error => {
              console.log('123');
              console.log(error);
              if (
                error.code === 'basket.validation.cost_center_missing.error' &&
                this.costCenterSelectForm.get('costCenter')
              ) {
                this.costCenterSelectForm.get('costCenter').markAsDirty();
                this.costCenterSelectForm.get('costCenter').setErrors({ required: false });
                this.cdRef.detectChanges();
              }
            })
        )
      )
    );
  }

  private getFields(options: { label: string; value: string }[]): FormlyFieldConfig[] {
    return [
      {
        key: 'costCenter',
        type: 'ish-select-field',
        templateOptions: {
          label: 'checkout.cost_center.select.label',
          required: true,
          options,
          placeholder: options.length > 1 ? 'account.option.select.text' : undefined,
        },
        asyncValidators: {
          validRequired: {
            expression: (control: FormControl) => {
              const a = this.checkoutFacade.basketValidationResults$;
              a.pipe(takeUntil(this.destroy$)).subscribe(() => {
                console.log('qwe');
              });
              a.pipe(
                map(results => {
                  console.log('abc');
                  return uniq(
                    results &&
                      results.errors &&
                      results.errors.map(error => {
                        console.log('123');
                        console.log(error);
                        control.setErrors(
                          error.code === 'basket.validation.cost_center_missing.error'
                            ? { validRequired: false }
                            : undefined
                        );
                      })
                  );
                })
              );
            },
          },
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
