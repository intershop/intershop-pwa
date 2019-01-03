// tslint:disable project-structure
import { memoize } from 'lodash-es';

import { ContentPageletView } from './content-views';

export interface ContentImagePageletView extends ContentPageletView {
  imagePath(configParam: string, staticUrl: string): string;
}

/**
 * @deprecated only visible for testing
 */
export const getImagePath = (configParam: string, staticURL: string): string => {
  // TODO: the local has to be considered too
  if (configParam && configParam.indexOf(':') > 0) {
    return `${staticURL}/${configParam.split(':')[0]}/-${configParam.split(':')[1]}`;
  }
  return configParam;
};

// tslint:disable deprecation
export const createImagePageletView = (pagelet: ContentPageletView): ContentImagePageletView =>
  !pagelet
    ? undefined
    : {
        ...pagelet,
        imagePath: memoize((configParam, staticUrl) => getImagePath(pagelet.stringParam(configParam), staticUrl)),
      };
