import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';

import { STATIC_URL } from '../../../core/services/state-transfer/factories';
import { ContentPageletHelper } from '../../../models/content-pagelet/content-pagelet.helper';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';

// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-cms-image-enhanced',
  templateUrl: './cms-image-enhanced.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSImageEnhancedComponent {
  @Input()
  pagelet: ContentPagelet;

  getConfigurationParameterValue = ContentPageletHelper.getConfigurationParameterValue;

  constructor(@Inject(STATIC_URL) private staticURL: string) {}

  getImagePath(configParam: string): string {
    // TODO: the local has to be considered too
    if (configParam.indexOf(':') > 0) {
      return `${this.staticURL}/${configParam.split(':')[0]}/-${configParam.split(':')[1]}`;
    }
    return configParam;
  }

  getRouterLink(configParam: string): string {
    const linkPrefix = configParam.split(':')[0];
    let routerLink = '/home';
    switch (linkPrefix) {
      case 'product':
        // for consistent product links it should have the default category in the route
        routerLink = `/product/${configParam.substring(10, configParam.indexOf('@'))}`;
        break;
      case 'category':
        // the configuration parameter currently only works for first level categories
        routerLink = `/category/${configParam.substring(11, configParam.indexOf('@'))}`;
        break;
      case 'page':
        // we do not yet have a '/page' route
        routerLink = `/page/${configParam.substring(7)}`;
        break;
      case 'route':
        // direct router links for the PWA
        routerLink = `/${configParam.substring(8)}`;
        break;
      case 'http':
      case 'https':
        // use 'href' instead of 'routerLink' with external links
        console.log('External links need handling', configParam);
        break;
      default:
        console.log('Unknown link type:', configParam);
    }
    return routerLink;
  }
}
