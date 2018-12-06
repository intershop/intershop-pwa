// tslint:disable:ccp-no-markup-in-containers
import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { CMSComponentInterface, CMSComponentProvider, CMS_COMPONENT } from '../../configurations/injection-keys';

@Component({
  selector: 'ish-content-pagelet',
  templateUrl: './content-pagelet.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageletContainerComponent implements OnInit {
  @Input()
  pagelet: ContentPageletView;

  noMappingFound: boolean;

  private components: CMSComponentProvider[] = [];

  @ViewChild('cmsOutlet', { read: ViewContainerRef })
  cmsOutlet: ViewContainerRef;

  constructor(injector: Injector, private componentFactoryResolver: ComponentFactoryResolver) {
    this.components = injector.get<CMSComponentProvider[]>(CMS_COMPONENT, []);
  }

  ngOnInit() {
    const component = this.components.find(c => c.definitionQualifiedName === this.pagelet.definitionQualifiedName);
    this.noMappingFound = !component;
    if (component) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<CMSComponentInterface>(component.class);
      const componentRef = this.cmsOutlet.createComponent(factory);
      componentRef.instance.pagelet = this.pagelet;
    }
  }
}
