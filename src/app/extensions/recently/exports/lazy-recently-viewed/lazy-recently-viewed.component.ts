import {
  ChangeDetectionStrategy,
  Component,
  createNgModuleRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Injector,
} from '@angular/core';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';

@Component({
  selector: 'ish-lazy-recently-viewed',
  templateUrl: './lazy-recently-viewed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyRecentlyViewedComponent implements OnInit {
  /*
   * WARNING!
   *
   * This file was automatically generated!
   * It should be updated using:
   *
   * ng g lazy-component extensions/recently/shared/recently-viewed/recently-viewed.component.ts
   *
   */

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  constructor(private featureToggleService: FeatureToggleService, private injector: Injector) {}

  async ngOnInit() {
    if (this.featureToggleService.enabled('recently')) {
      const module = await import(`../../recently.module`).then(m => m.RecentlyModule);

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { RecentlyViewedComponent } = await import('../../shared/recently-viewed/recently-viewed.component');

      const moduleRef = createNgModuleRef(module, this.injector);

      this.anchor.createComponent(RecentlyViewedComponent, { ngModuleRef: moduleRef }).changeDetectorRef.markForCheck();
    }
  }
}
