import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EnvironmentInjector,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { ContentDesignViewWrapperComponent } from 'ish-shared/cms/components/content-design-view-wrapper/content-design-view-wrapper.component';
import { CMSComponentProvider, CMS_COMPONENT } from 'ish-shared/cms/configurations/injection-keys';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

/**
 * The Content Pagelet Component renders the pagelet for the given 'pageletId'.
 * For the rendering an Angular component is used that has to be provided
 * for the DefinitionQualifiedName of the pagelet.
 *
 * @example
 * <ish-content-pagelet [pageletId]="pagelet"></ish-content-pagelet>
 */
@Component({
  selector: 'ish-content-pagelet',
  templateUrl: './content-pagelet.component.html',
  styleUrls: ['./content-pagelet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ContentDesignViewWrapperComponent, LoadingComponent],
})
export class ContentPageletComponent implements OnChanges, OnInit {
  private static readonly FEATURED_PRODUCTS_PAGELET_PREFIX = 'pwa_featured_products';

  /**
   * The Id of the Pagelet that is to be rendered.
   */
  @Input() pageletId: string;

  @ViewChild('cmsOutlet', { read: ViewContainerRef, static: true }) cmsOutlet: ViewContainerRef;

  pageletRendered = false;

  private pageletId$ = new ReplaySubject<string>(1);
  private destroyRef = inject(DestroyRef);
  private environmentInjector = inject(EnvironmentInjector);

  constructor(private injector: Injector, private cmsFacade: CMSFacade, private cdRef: ChangeDetectorRef) {}
  ngOnInit() {
    this.pageletId$
      .pipe(
        switchMap(pageletId => this.cmsFacade.pagelet$(pageletId)),
        whenTruthy(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(pagelet => {
        this.mapComponent(pagelet);
        this.pageletRendered = true;
        this.cdRef.markForCheck();
      });
  }

  ngOnChanges() {
    this.pageletRendered = false;
    this.pageletId$.next(this.pageletId);
  }

  private mapComponent(pagelet: ContentPageletView) {
    const components = this.injector.get<CMSComponentProvider[]>(CMS_COMPONENT, []);
    const mappedComponent = components.find(c => c.definitionQualifiedName === pagelet.definitionQualifiedName);

    if (mappedComponent) {
      const componentRef = this.createComponent(mappedComponent);
      this.initializeComponent(componentRef.instance, pagelet);
    } else {
      console.warn(`did not find mapping for ${pagelet.id} (${pagelet.definitionQualifiedName})`);
    }
  }

  private createComponent(mappedComponent: CMSComponentProvider) {
    this.cmsOutlet.clear();
    return this.cmsOutlet.createComponent(mappedComponent.class, {
      environmentInjector: this.environmentInjector,
    });
  }

  private initializeComponent(instance: CMSComponent, pagelet: ContentPageletView) {
    instance.pagelet = pagelet;

    // OnChanges has to be manually invoked on dynamically created components
    if (instance.ngOnChanges) {
      instance.ngOnChanges({ pagelet: new SimpleChange(undefined, pagelet, true) });
    }
  }

  get shouldShowPlaceholder(): boolean {
    return !this.pageletRendered && this.hasFeaturedProductsPlaceholder(this.pageletId);
  }

  private hasFeaturedProductsPlaceholder(pageletId: string): boolean {
    return pageletId?.startsWith(ContentPageletComponent.FEATURED_PRODUCTS_PAGELET_PREFIX);
  }
}
