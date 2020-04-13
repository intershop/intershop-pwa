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
import { Product } from 'ish-core/models/product/product.model';

import { ProductAddToOrderTemplateComponent } from '../../../shared/product/product-add-to-order-template/product-add-to-order-template.component';

@Component({
  selector: 'ish-lazy-product-add-to-order-template',
  templateUrl: './lazy-product-add-to-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyProductAddToOrderTemplateComponent implements OnInit, OnChanges {
  /*
   * WARNING!
   *
   * This file was automatically generated!
   * It should be updated using:
   *
   * ng g lazy-component extensions/order-templates/shared/product/product-add-to-order-template/product-add-to-order-template.component.ts
   *
   */

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;
  @Input() product: Product;
  @Input() quantity: number;
  @Input() displayType?: 'icon' | 'link' | 'animated' = 'link';
  @Input() class?: string;

  private component: ComponentRef<ProductAddToOrderTemplateComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit() {
    if (this.featureToggleService.enabled('orderTemplates')) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(ProductAddToOrderTemplateComponent);
      this.component = this.anchor.createComponent(factory);
      this.ngOnChanges();
    }
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.product = this.product;
      this.component.instance.quantity = this.quantity;
      this.component.instance.displayType = this.displayType;
      this.component.instance.class = this.class;
    }
  }
}
