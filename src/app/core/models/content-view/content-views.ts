// tslint:disable:project-structure
// due to recursive depending types the definitions must remain in the same file
import { memoize, once } from 'lodash-es';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentConfigurationParameters } from '../content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentPagelet } from '../content-pagelet/content-pagelet.model';
import { ContentSlot } from '../content-slot/content-slot.model';

export interface ConfigParameterView {
  hasParam(key: string): boolean;
  stringParam(key: string, defaultValue?: string): string;
  numberParam(key: string, defaultValue?: number): number;
  booleanParam(key: string, defaultValue?: boolean): boolean;
  configParam<T extends object>(key: string): T;
}

export interface ContentSlotView extends ConfigParameterView {
  pagelets(): ContentPageletView[];
}

export interface ContentPageletEntryPointView extends ConfigParameterView {
  id: string;
  name: string;
  pagelets(): ContentPageletView[];
}

export interface ContentPageletView extends ConfigParameterView {
  definitionQualifiedName: string;
  configurationParameters: ContentConfigurationParameters;
  id: string;
  slot(qualifiedName: string): ContentSlotView;
}

const paramMemoize = (key, defaultValue) => JSON.stringify({ key, defaultValue });

export const createConfigParameterView = (params: ContentConfigurationParameters): ConfigParameterView => ({
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

// tslint:disable no-use-before-declare
// due to cyclic dependencies of slot and pagelets

export const createPageletView = (id: string, pagelets: { [id: string]: ContentPagelet }): ContentPageletView => {
  const pagelet = pagelets[id];
  return {
    definitionQualifiedName: pagelet.definitionQualifiedName,
    configurationParameters: pagelet.configurationParameters,
    id: pagelet.id,
    slot: !pagelet.slots
      ? () => undefined
      : memoize(qualifiedName =>
          createSlotView(pagelet.slots.find(slot => slot.definitionQualifiedName === qualifiedName), pagelets)
        ),
    ...createConfigParameterView(pagelet.configurationParameters || {}),
  };
};

export const createSlotView = (slot: ContentSlot, pagelets: { [id: string]: ContentPagelet }): ContentSlotView =>
  !slot
    ? undefined
    : {
        pagelets: !slot.pageletIDs ? () => [] : once(() => slot.pageletIDs.map(id => createPageletView(id, pagelets))),
        ...createConfigParameterView(slot.configurationParameters || {}),
      };

export const createContentPageletEntryPointView = (
  pageletEntryPoint: ContentPageletEntryPoint,
  pagelets: { [id: string]: ContentPagelet }
): ContentPageletEntryPointView => ({
  id: pageletEntryPoint.id,
  name: pageletEntryPoint.displayName,
  ...createSlotView(pageletEntryPoint, pagelets),
});
