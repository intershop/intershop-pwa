import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { debounceTime, map } from 'rxjs/operators';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

/**
 * The Quick Order Repeat Component provides a formly field element, which displays a field array of n elements depending on the according model.
 * Each line displays a form field for the sku and for the according quantity.
 * The component handles adding and removing of elements to the according formly model.
 * The component controls the product contexts for a proper behavior between entered product sku and its quantity field.
 */
@Component({
  selector: 'ish-quickorder-repeat-field',
  templateUrl: './quickorder-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderRepeatFieldComponent extends FieldArrayType implements AfterViewInit {
  @ViewChildren(ProductContextDirective) contexts: QueryList<{ context: ProductContextFacade }>;

  constructor(private cdRef: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit() {
    this.updateContexts();
  }

  addMultipleRows(rows: number) {
    for (let i = 0; i < rows; i++) {
      this.add(this.model.length, { sku: '', quantity: 1 });
    }
    this.updateContexts();
  }

  /**
   * Set the form control field to the according product context and handle its behavior.
   */
  updateContexts() {
    this.cdRef.detectChanges();
    this.contexts.forEach((context: { context: ProductContextFacade }, index) => {
      const field = this.field.fieldGroup[index].fieldGroup[0];
      const formControl = field.formControl;

      context.context.connect('sku', formControl.valueChanges.pipe(debounceTime(500)));
      formControl.setAsyncValidators(() =>
        context.context.select('product').pipe(
          map(product => {
            this.cdRef.markForCheck();
            return product.failed && formControl.value.trim !== '' ? { validProduct: false } : undefined;
          })
        )
      );
    });
  }
}
