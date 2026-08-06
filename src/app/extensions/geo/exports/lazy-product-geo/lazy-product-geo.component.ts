import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
  createNgModule,
} from '@angular/core';

import type { ProductGeoComponent as OriginalComponent } from '../../shared/product-geo/product-geo.component';

@Component({
  selector: 'ish-lazy-product-geo',
  standalone: false,
  templateUrl: './lazy-product-geo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyProductGeoComponent implements OnInit, OnChanges {
  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  @Input() type: OriginalComponent['type'];

  private component: ComponentRef<OriginalComponent>;

  constructor(private injector: Injector) {}

  ngOnInit() {
    this.renderComponent();
  }

  private async renderComponent() {
    const module = await import(`../../geo.module`).then(m => m.GeoModule);

    const { ProductGeoComponent: originalComponent } = await import('../../shared/product-geo/product-geo.component');

    const ngModuleRef = createNgModule(module, this.injector);

    this.component = this.anchor.createComponent(originalComponent, { ngModuleRef });

    this.ngOnChanges();

    this.component.changeDetectorRef.markForCheck();
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.type = this.type;
    }
  }
}
