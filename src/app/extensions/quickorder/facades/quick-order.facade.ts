import { ChangeDetectorRef, Injectable } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.helper';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';
import { EMPTY, Observable } from 'rxjs';
import { debounceTime, map, mapTo, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export abstract class QuickOrderFacade {

  constructor(private shoppingFacade: ShoppingFacade) {}

  validateProductFunction(cdRef: ChangeDetectorRef): AsyncValidatorFn {
    return (control: FormGroup) =>
      (control.valueChanges &&
        control.valueChanges.pipe(
          debounceTime(500),
          map(({ sku }) => sku),
          switchMap(sku => this.shoppingFacade.product$(sku, ProductCompletenessLevel.List)),
          tap(product => {
            const failed = ProductHelper.isFailedLoading(product);
            control.get('sku').setErrors(failed ? { not_exists: true } : undefined);
            const quantityControl = control.get('quantity') as FormControl;
            quantityControl.setValidators(
              failed
                ? []
                : [
                    Validators.required,
                    SpecialValidators.integer,
                    Validators.min(product.minOrderQuantity),
                    Validators.max(product.maxOrderQuantity),
                  ]
            );

            control.get('product').setValue(product, { emitEvent: false });

            if (!quantityControl.value) {
              quantityControl.setValue(product.minOrderQuantity, { emitEvent: false });
            }

            control.updateValueAndValidity({ emitEvent: false });
            cdRef.markForCheck();
          }),
          mapTo(undefined)
        )) ||
      EMPTY;
  }
}
