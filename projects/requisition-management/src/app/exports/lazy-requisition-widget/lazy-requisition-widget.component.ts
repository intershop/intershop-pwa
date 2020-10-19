import {
  ChangeDetectionStrategy,
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'ish-lazy-requisition-widget',
  templateUrl: './lazy-requisition-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyRequisitionWidgetComponent implements OnInit {
  /*
   * WARNING!
   *
   * This file was automatically generated!
   * It should be updated using:
   *
   * ng g lazy-component components/requisition-widget/requisition-widget.component.ts
   *
   */

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  constructor(private compiler: Compiler, private injector: Injector) {}

  async ngOnInit() {
    // prevent cyclic dependency warnings
    const extension = 'requisition-management';
    const moduleObj = await import(`../../${extension}.module`);
    const module = moduleObj[Object.keys(moduleObj)[0]];

    const { RequisitionWidgetComponent } = await import(
      '../../components/requisition-widget/requisition-widget.component'
    );

    const moduleFactory = await this.loadModuleFactory(module);
    const moduleRef = moduleFactory.create(this.injector);
    const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(RequisitionWidgetComponent);

    this.anchor.createComponent(factory).changeDetectorRef.markForCheck();
  }

  private async loadModuleFactory(t) {
    if (t instanceof NgModuleFactory) {
      return t;
    } else {
      return await this.compiler.compileModuleAsync(t);
    }
  }
}
