import {
  ChangeDetectionStrategy,
  Compiler,
  Component,
  ComponentRef,
  Injector,
  Input,
  NgModuleFactory,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { Basket } from 'ish-core/models/basket/basket.model';

@Component({
  selector: 'ish-lazy-checkout-receipt-requisition',
  templateUrl: './lazy-checkout-receipt-requisition.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyCheckoutReceiptRequisitionComponent implements OnInit, OnChanges {
  @Input() basket: Basket;

  // tslint:disable-next-line: no-any
  private component: ComponentRef<any>;

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  constructor(private compiler: Compiler, private injector: Injector) {}

  async ngOnInit() {
    // prevent cyclic dependency warnings
    const extension = 'requisition-management';
    const moduleObj = await import(`../../${extension}.module`);
    const module = moduleObj[Object.keys(moduleObj)[0]];

    const { CheckoutReceiptRequisitionComponent } = await import(
      '../../components/checkout-receipt-requisition/checkout-receipt-requisition.component'
    );

    const moduleFactory = await this.loadModuleFactory(module);
    const moduleRef = moduleFactory.create(this.injector);
    const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(CheckoutReceiptRequisitionComponent);

    this.component = this.anchor.createComponent(factory);
    this.ngOnChanges();
    this.component.changeDetectorRef.markForCheck();
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.basket = this.basket;
    }
  }

  private async loadModuleFactory(t) {
    if (t instanceof NgModuleFactory) {
      return t;
    } else {
      return await this.compiler.compileModuleAsync(t);
    }
  }
}
