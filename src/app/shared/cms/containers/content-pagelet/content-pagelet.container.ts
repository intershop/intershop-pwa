import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnChanges,
  SimpleChange,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { CMSComponentProvider, CMS_COMPONENT } from '../../configurations/injection-keys';
import { CMSComponent } from '../../models/cms-component/cms-component.model';
import { SfeAdapterService } from '../../sfe-adapter/sfe-adapter.service';
import { SfeMetadataWrapper } from '../../sfe-adapter/sfe-metadata-wrapper';
import { SfeMapper } from '../../sfe-adapter/sfe.mapper';

/**
 * The Content Pagelet Container Component renders the given 'pagelet'.
 * For the rendering an Angular component is used that has to be provided
 * for the DefinitionQualifiedName of the pagelet.
 *
 * @example
 * <ish-content-pagelet [pagelet]="pagelet"></ish-content-pagelet>
 */
@Component({
  selector: 'ish-content-pagelet',
  templateUrl: './content-pagelet.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:ccp-no-markup-in-containers ccp-no-intelligence-in-components
export class ContentPageletContainerComponent extends SfeMetadataWrapper implements OnChanges {
  /**
   * The Pagelet that is to be rendered.
   */
  @Input() pagelet: ContentPageletView;

  noMappingFound: boolean;

  private components: CMSComponentProvider[] = [];

  @ViewChild('cmsOutlet', { read: ViewContainerRef })
  cmsOutlet: ViewContainerRef;

  constructor(
    injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sfeAdapter: SfeAdapterService
  ) {
    super();
    this.components = injector.get<CMSComponentProvider[]>(CMS_COMPONENT, []);
  }

  ngOnChanges() {
    this.mapComponent();

    if (this.pagelet && this.sfeAdapter.isInitialized()) {
      this.setSfeMetadata(SfeMapper.mapPageletViewToSfeMetadata(this.pagelet));
    }
  }

  private mapComponent() {
    const mappedComponent = this.components.find(
      c => c.definitionQualifiedName === this.pagelet.definitionQualifiedName
    );

    if (mappedComponent) {
      const componentRef = this.createComponent(mappedComponent);
      this.initializeComponent(componentRef.instance);
    }

    this.noMappingFound = !mappedComponent;
  }

  private createComponent(mappedComponent: CMSComponentProvider) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(mappedComponent.class);
    this.cmsOutlet.clear();
    return this.cmsOutlet.createComponent(factory);
  }

  private initializeComponent(instance: CMSComponent) {
    instance.pagelet = this.pagelet;

    // OnChanges has to be manually invoked on dynamically created components
    if (instance.ngOnChanges) {
      instance.ngOnChanges({ pagelet: new SimpleChange(undefined, this.pagelet, true) });
    }
  }
}
