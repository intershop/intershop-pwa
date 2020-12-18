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
  selector: 'ish-lazy-budget-widget',
  templateUrl: './lazy-budget-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyBudgetWidgetComponent implements OnInit {
  /*
   * WARNING!
   *
   * This file was automatically generated!
   * It should be updated using:
   *
   * ng g lazy-component components/budget-widget/budget-widget.component.ts
   *
   */

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  constructor(private compiler: Compiler, private injector: Injector) {}

  async ngOnInit() {
    // prevent cyclic dependency warnings
    const extension = 'organization-management';
    const moduleObj = await import(`../../${extension}.module`);
    const module = moduleObj[Object.keys(moduleObj)[0]];

    const { BudgetWidgetComponent } = await import('../../components/budget-widget/budget-widget.component');

    const moduleFactory = await this.loadModuleFactory(module);
    const moduleRef = moduleFactory.create(this.injector);
    const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(BudgetWidgetComponent);

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
