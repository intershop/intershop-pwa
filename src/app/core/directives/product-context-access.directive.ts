import { Directive, EmbeddedViewRef, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductContext, ProductContextFacade } from 'ish-core/facades/product-context.facade';

type ProductContextAccessContext = ProductContext & { context: ProductContextFacade };

@Directive({
  selector: '[ishProductContextAccess]',
})
export class ProductContextAccessDirective implements OnDestroy {
  private view: EmbeddedViewRef<ProductContextAccessContext>;
  private destroy$ = new Subject();

  constructor(
    context: ProductContextFacade,
    viewContainer: ViewContainerRef,
    template: TemplateRef<ProductContextAccessContext>
  ) {
    context
      .select()
      .pipe(takeUntil(this.destroy$))
      .subscribe(ctx => {
        if (!this.view && ctx?.product) {
          this.view = viewContainer.createEmbeddedView(template, { ...ctx, context });
        } else if (this.view && ctx?.product) {
          // tslint:disable-next-line: ban
          Object.assign(this.view.context, ctx);
        }

        if (this.view) {
          this.view.markForCheck();
        }
      });
  }

  static ngTemplateContextGuard(_: ProductContextAccessDirective, ctx: unknown): ctx is ProductContextAccessContext {
    return !!ctx || true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
