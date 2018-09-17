// tslint:disable project-structure
import { memoize } from 'lodash-es';

import { ContentPageletView } from './content-views';

export interface ContentImagePageletView extends ContentPageletView {
  routerLink(configParam: string): string;
  imagePath(configParam: string, staticUrl: string): string;
}

/**
 * @deprecated only visible for testing
 */
export const getImagePath = (configParam: string, staticURL: string): string => {
  // TODO: the local has to be considered too
  if (!!configParam && configParam.indexOf(':') > 0) {
    return `${staticURL}/${configParam.split(':')[0]}/-${configParam.split(':')[1]}`;
  }
  return configParam;
};

/**
 * @deprecated only visible for testing
 */
export const getRouterLink = (configParam: string): string => {
  let routerLink = '/home';
  const linkPrefix = !!configParam && configParam.includes(':') ? configParam.split(':')[0] : undefined;
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
};

// tslint:disable deprecation
export const createImagePageletView = (pagelet: ContentPageletView): ContentImagePageletView =>
  !pagelet
    ? undefined
    : {
        ...pagelet,
        imagePath: memoize((configParam, staticUrl) => getImagePath(pagelet.stringParam(configParam), staticUrl)),
        routerLink: memoize(configParam => getRouterLink(pagelet.stringParam(configParam))),
      };
