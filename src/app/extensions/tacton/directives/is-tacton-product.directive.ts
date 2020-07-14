import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { TactonFacade } from '../facades/tacton.facade';

@Directive({
  selector: '[ishIsTactonProduct]',
})
export class IsTactonProductDirective implements OnDestroy {
  // tslint:disable-next-line: no-any
  private otherTemplateRef: TemplateRef<any>;
  private sku$ = new ReplaySubject<string>(1);

  private destroy$ = new Subject();

  constructor(
    // tslint:disable-next-line:no-any
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    tactonFacade: TactonFacade
  ) {
    tactonFacade
      .getTactonProductForSKU$(this.sku$)
      .pipe(
        map(x => !!x),
        takeUntil(this.destroy$)
      )
      .subscribe(exists => this.updateView(exists));
  }

  @Input() set ishIsTactonProduct(product: ProductView) {
    this.sku$.next(product?.sku);
  }

  // tslint:disable-next-line: no-any
  @Input() set ishIsTactonProductElse(otherTemplateRef: TemplateRef<any>) {
    this.otherTemplateRef = otherTemplateRef;
  }

  private updateView(exists: boolean) {
    this.viewContainer.clear();
    if (exists) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.otherTemplateRef) {
      this.viewContainer.createEmbeddedView(this.otherTemplateRef);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
