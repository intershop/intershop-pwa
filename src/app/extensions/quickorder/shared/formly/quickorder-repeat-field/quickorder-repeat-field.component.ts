import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FieldArrayType } from '@ngx-formly/core';
import { debounceTime, take } from 'rxjs/operators';

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
  standalone: false,
  templateUrl: './quickorder-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderRepeatFieldComponent extends FieldArrayType implements AfterViewInit {
  @ViewChildren(ProductContextDirective) contexts: QueryList<{ context: ProductContextFacade }>;

  private readonly destroyRef = inject(DestroyRef);

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
    this.updateContextsOnNextRender();
  }

  removeRow(index: number) {
    this.remove(index);
    this.updateContextsOnNextRender();
  }

  /**
   * Set the form control field to the according product context and handle its behavior.
   */
  private updateContexts() {
    this.contexts.forEach((context: { context: ProductContextFacade }, index) => {
      const field = this.field.fieldGroup[index].fieldGroup[0];

      // only wire up rows that are not connected yet to avoid duplicate subscriptions
      if (field.props.productContext === context.context) {
        return;
      }

      // expose the product context to the field so its configured validators can access it
      field.props.productContext = context.context;
      context.context.connect('sku', field.formControl.valueChanges.pipe(debounceTime(500)));
    });
    this.cdRef.markForCheck();
  }

  /**
   * Rows are rendered asynchronously, so wait for the next rendered-rows change before wiring up the contexts.
   */
  private updateContextsOnNextRender() {
    this.contexts.changes.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateContexts());
  }
}
