import { ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { TactonFacade } from '../facades/tacton.facade';

@Directive({
  selector: '[ishIsTactonProduct]',
})
export class IsTactonProductDirective implements OnDestroy {
  private otherTemplateRef: TemplateRef<unknown>;
  private sku$ = new ReplaySubject<string>(1);
  private trigger$ = new Subject<void>();

  private destroy$ = new Subject();

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    tactonFacade: TactonFacade
  ) {
    this.trigger$
      .pipe(
        switchMap(() => tactonFacade.getTactonProductForSKU$(this.sku$).pipe(map(x => !!x))),
        takeUntil(this.destroy$)
      )
      .subscribe(exists => this.updateView(exists));
  }

  @Input() set ishIsTactonProduct(product: ProductView) {
    this.sku$.next(product?.sku);
    this.trigger$.next();
  }

  @Input() set ishIsTactonProductElse(otherTemplateRef: TemplateRef<unknown>) {
    this.otherTemplateRef = otherTemplateRef;
    this.trigger$.next();
  }

  private updateView(exists: boolean) {
    this.viewContainer.clear();
    if (exists) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.otherTemplateRef) {
      this.viewContainer.createEmbeddedView(this.otherTemplateRef);
    }
    this.cdRef.markForCheck();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
