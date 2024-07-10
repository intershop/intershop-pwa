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
import type { OrganizationHierarchiesGroupNameComponent as OriginalComponent } from '../../shared/organization-hierarchies-group-name/organization-hierarchies-group-name.component';

@Component({
  selector: 'ish-lazy-organization-hierarchies-group-name',
  templateUrl: './lazy-organization-hierarchies-group-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyOrganizationHierarchiesGroupNameComponent implements OnInit, OnChanges {
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

    const { OrganizationHierarchiesGroupNameComponent: originalComponent } = await import(
      '../../shared/organization-hierarchies-group-name/organization-hierarchies-group-name.component'
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
