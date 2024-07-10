import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DestroyRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
  createNgModule,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import type { OrganizationHierarchiesSwitchComponent as OriginalComponent } from '../../shared/organization-hierarchies-switch/organization-hierarchies-switch.component';

@Component({
  selector: 'ish-lazy-organization-hierarchies-switch',
  templateUrl: './lazy-organization-hierarchies-switch.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LazyOrganizationHierarchiesSwitchComponent implements OnInit, OnChanges {
  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  @Input() placement: OriginalComponent['placement'];

  private component: ComponentRef<OriginalComponent>;
  private destroyRef = inject(DestroyRef);

  constructor(private organizationHierarchiesFacade: OrganizationHierarchiesFacade, private injector: Injector) {}

  ngOnInit() {
    this.organizationHierarchiesFacade.isServiceAvailable$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async enabled => {
        if (enabled) {
          await this.renderComponent();
        } else {
          this.anchor.clear();
        }
      });
  }

  private async renderComponent() {
    const module = await import(`../../organization-hierarchies.module`).then(m => m.OrganizationHierarchiesModule);

    const { OrganizationHierarchiesSwitchComponent: originalComponent } = await import(
      '../../shared/organization-hierarchies-switch/organization-hierarchies-switch.component'
    );

    const ngModuleRef = createNgModule(module, this.injector);

    this.component = this.anchor.createComponent(originalComponent, { ngModuleRef });

    this.ngOnChanges();

    this.component.changeDetectorRef.markForCheck();
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.placement = this.placement;
    }
  }
}
