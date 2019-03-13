import { ContentConfigurationParameterView } from './content-views';

export class ContentViewHelper {
  static getRouterLink(pagelet: ContentConfigurationParameterView, configParam: string): string {
    const configParamValue = pagelet.stringParam(configParam);
    let routerLink = '/home';
    const linkPrefix =
      !!configParamValue && configParamValue.includes(':') ? configParamValue.split(':')[0] : undefined;
    switch (linkPrefix) {
      case 'product':
        // TODO: for consistent product links it should have the default category in the route
        routerLink = `/product/${configParamValue.substring(10, configParamValue.indexOf('@'))}`;
        break;
      case 'category':
        // TODO: the configuration parameter currently only works for first level categories
        routerLink = `/category/${configParamValue.substring(11, configParamValue.indexOf('@'))}`;
        break;
      case 'page':
        // TODO: we do not yet have a '/page' route
        routerLink = `/page/${configParamValue.substring(7)}`;
        break;
      case 'route':
        // direct router links for the PWA
        routerLink = `/${configParamValue.substring(8)}`;
        break;
      case 'http':
      case 'https':
        // TODO: use 'href' instead of 'routerLink' with external links
        // tslint:disable-next-line:no-console
        console.log('External links need handling', configParamValue);
        break;
      default:
        // tslint:disable-next-line:no-console
        console.log('Unknown link type:', configParamValue);
    }
    return routerLink;
  }
}
