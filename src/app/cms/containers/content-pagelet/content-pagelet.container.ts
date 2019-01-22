// tslint:disable:ccp-no-markup-in-containers
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

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { SfeMapper } from '../../../cms/sfe-adapter/sfe.mapper';
import { CMSComponentInterface, CMSComponentProvider, CMS_COMPONENT } from '../../configurations/injection-keys';

@Component({
  selector: 'ish-content-pagelet',
  templateUrl: './content-pagelet.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageletContainerComponent implements OnChanges {
  @Input() pagelet: ContentPageletView;

  noMappingFound: boolean;

  private components: CMSComponentProvider[] = [];

  @ViewChild('cmsOutlet', { read: ViewContainerRef })
  cmsOutlet: ViewContainerRef;

  constructor(injector: Injector, private componentFactoryResolver: ComponentFactoryResolver) {
    this.components = injector.get<CMSComponentProvider[]>(CMS_COMPONENT, []);
  }

  ngOnChanges() {
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

  private initializeComponent(instance: CMSComponentInterface) {
    instance.pagelet = this.pagelet;
    instance.setSfeMetadata(SfeMapper.mapPageletViewToSfeMetadata(this.pagelet));

    // OnChanges has to be manually invoked on dynamically created components
    if (instance.ngOnChanges) {
      instance.ngOnChanges({ pagelet: new SimpleChange(undefined, this.pagelet, true) });
    }
  }
}
