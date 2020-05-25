import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';

import { BasketCreateOrderTemplateComponent } from '../../../shared/basket/basket-create-order-template/basket-create-order-template.component';

@Component({
  selector: 'ish-lazy-basket-create-order-template',
  templateUrl: './lazy-basket-create-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyBasketCreateOrderTemplateComponent implements OnInit, OnChanges {
  /*
   * WARNING!
   *
   * This file was automatically generated!
   * It should be updated using:
   *
   * ng g lazy-component extensions/order-templates/shared/basket/basket-create-order-template/basket-create-order-template.component.ts
   *
   */

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;
  @Input() products: LineItemView[];
  @Input() class?: string;

  private component: ComponentRef<BasketCreateOrderTemplateComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit() {
    if (this.featureToggleService.enabled('orderTemplates')) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(BasketCreateOrderTemplateComponent);
      this.component = this.anchor.createComponent(factory);
      this.ngOnChanges();
    }
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.products = this.products;
      this.component.instance.class = this.class;
    }
  }
}
