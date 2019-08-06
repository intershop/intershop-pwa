// tslint:disable:project-structure
// due to recursive depending types the definitions must remain in the same file
import { memoize, once } from 'lodash-es';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentConfigurationParameters } from '../content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentPagelet } from '../content-pagelet/content-pagelet.model';
import { ContentSlot } from '../content-slot/content-slot.model';

export interface ContentConfigurationParameterView {
  hasParam(key: string): boolean;
  stringParam(key: string, defaultValue?: string): string;
  numberParam(key: string, defaultValue?: number): number;
  booleanParam(key: string, defaultValue?: boolean): boolean;
  configParam<T extends object>(key: string): T;
}

export interface ContentEntryPointView {
  id: string;
  domain: string;
  displayName?: string;
  pagelets(): ContentPageletView[];
}

export interface ContentSlotView extends ContentEntryPointView, ContentConfigurationParameterView {}

export interface ContentPageletEntryPointView extends ContentEntryPointView, ContentConfigurationParameterView {
  id: string;
  domain: string;
  displayName: string;
  resourceSetId: string;
  pagelets(): ContentPageletView[];
}

export interface ContentPageletView extends ContentConfigurationParameterView {
  definitionQualifiedName: string;
  configurationParameters: ContentConfigurationParameters;
  id: string;
  domain: string;
  displayName: string;
  slot(qualifiedName: string): ContentSlotView;
}

const paramMemoize = (key, defaultValue) => JSON.stringify({ key, defaultValue });

export const createContentConfigurationParameterView = (
  params: ContentConfigurationParameters
): ContentConfigurationParameterView => ({
  hasParam: memoize(key => Object.keys(params).includes(key)),
  booleanParam: memoize(
    (key, defaultValue = undefined) =>
      Object.keys(params).includes(key)
        ? typeof params[key] === 'string' && (params[key] as string).toLowerCase().trim() === 'true'
        : defaultValue,
    paramMemoize
  ),
  stringParam: memoize(
    (key, defaultValue = undefined) =>
      Object.keys(params).includes(key)
        ? typeof params[key] === 'string'
          ? (params[key] as string)
          : JSON.stringify(params[key])
        : defaultValue,
    paramMemoize
  ),
  numberParam: memoize((key, defaultValue = NaN) => Number(params[key]) || defaultValue, paramMemoize),
  configParam: <T extends object>(key) => params[key] as T,
});

export const createContentPageletView = (
  id: string,
  pagelets: { [id: string]: ContentPagelet }
): ContentPageletView => {
  const pagelet = pagelets[id];
  return {
    definitionQualifiedName: pagelet.definitionQualifiedName,
    configurationParameters: pagelet.configurationParameters,
    id: pagelet.id,
    domain: pagelet.domain,
    displayName: pagelet.displayName,
    slot: !pagelet.slots
      ? () => undefined
      : memoize(qualifiedName =>
          createContentSlotView(
            pagelet,
            pagelet.slots.find(slot => slot.definitionQualifiedName === qualifiedName),
            pagelets
          )
        ),
    ...createContentConfigurationParameterView(pagelet.configurationParameters || {}),
  };
};

export const createContentEntryPointView = (
  id: string,
  domain: string,
  pageletIDs: string[],
  pagelets: { [id: string]: ContentPagelet }
): ContentEntryPointView => ({
  id,
  domain,
  pagelets:
    pageletIDs && pageletIDs.length
      ? once(() => pageletIDs.map(pId => createContentPageletView(pId, pagelets)))
      : () => [],
});

export const createContentSlotView = (
  pagelet: ContentPagelet,
  slot: ContentSlot,
  pagelets: { [id: string]: ContentPagelet }
): ContentSlotView =>
  !slot
    ? undefined
    : {
        ...createContentEntryPointView(slot.definitionQualifiedName, pagelet.domain, slot.pageletIDs, pagelets),
        ...createContentConfigurationParameterView(slot.configurationParameters || {}),
        displayName: slot.displayName,
      };

export const createContentPageletEntryPointView = (
  pageletEntryPoint: ContentPageletEntryPoint,
  pagelets: { [id: string]: ContentPagelet }
): ContentPageletEntryPointView => ({
  id: pageletEntryPoint.id,
  domain: pageletEntryPoint.domain,
  resourceSetId: pageletEntryPoint.resourceSetId,
  displayName: pageletEntryPoint.displayName,
  ...createContentEntryPointView(
    pageletEntryPoint.id,
    pageletEntryPoint.domain,
    pageletEntryPoint.pageletIDs,
    pagelets
  ),
  ...createContentConfigurationParameterView(pageletEntryPoint.configurationParameters || {}),
});
