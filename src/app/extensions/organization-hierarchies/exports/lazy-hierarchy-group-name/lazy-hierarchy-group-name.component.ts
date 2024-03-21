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
import type { HierarchyGroupNameComponent as OriginalComponent } from '../../shared/hierarchy-group-name/hierarchy-group-name.component';

@Component({
  selector: 'ish-lazy-hierarchy-group-name',
  templateUrl: './lazy-hierarchy-group-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyHierarchyGroupNameComponent implements OnInit, OnChanges {
  /*
   * WARNING!
   *
   * This file was automatically generated!
   * It should be updated using:
   *
   * ng g lazy-component extensions/organization-hierarchies/shared/hierarchy-group-name/hierarchy-group-name.component.ts
   *
   */

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  @Input() buyingContext: OriginalComponent['buyingContext'];

  @Input() showLabel: OriginalComponent['showLabel'];

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

    const { HierarchyGroupNameComponent: originalComponent } = await import(
      '../../shared/hierarchy-group-name/hierarchy-group-name.component'
    );

    const ngModuleRef = createNgModule(module, this.injector);

    this.component = this.anchor.createComponent(originalComponent, { ngModuleRef });

    this.ngOnChanges();

    this.component.changeDetectorRef.markForCheck();
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.buyingContext = this.buyingContext;

      this.component.instance.showLabel = this.showLabel;
    }
  }
}
