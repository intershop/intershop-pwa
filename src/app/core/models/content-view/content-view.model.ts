import { memoize } from 'lodash-es';

import { ContentConfigurationParameters } from 'ish-core/models/content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentSlot } from 'ish-core/models/content-slot/content-slot.model';
import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';

export interface ContentConfigurationParameterView {
  hasParam(key: string): boolean;
  stringParam(key: string, defaultValue?: string): string;
  numberParam(key: string, defaultValue?: number): number;
  booleanParam(key: string, defaultValue?: boolean): boolean;
  configParam<T extends object>(key: string): T;
}

interface ContentEntryPointView {
  id: string;
  domain: string;
  displayName?: string;
  pageletIDs: string[];
}

interface ContentSlotView extends ContentEntryPointView, ContentConfigurationParameterView {}

export interface ContentPageletEntryPointView extends ContentEntryPointView, ContentConfigurationParameterView {
  id: string;
  domain: string;
  displayName: string;
  resourceSetId: string;
  pageletIDs: string[];
  seoAttributes: SeoAttributes;
}

export interface ContentPageletView extends ContentConfigurationParameterView {
  definitionQualifiedName: string;
  configurationParameters: ContentConfigurationParameters;
  id: string;
  domain: string;
  displayName: string;
  slot(qualifiedName: string): ContentSlotView;
}

const paramMemoize = <T>(key: string, defaultValue: T) => JSON.stringify({ key, defaultValue });

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
  // tslint:disable-next-line: no-unnecessary-type-annotation
  configParam: <T extends object>(key: string) => params[key] as T,
});

export const createContentPageletView = (pagelet: ContentPagelet): ContentPageletView =>
  pagelet && {
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
            pagelet.slots.find(slot => slot.definitionQualifiedName === qualifiedName)
          )
        ),
    ...createContentConfigurationParameterView(pagelet.configurationParameters || {}),
  };

const createContentSlotView = (pagelet: ContentPagelet, slot: ContentSlot): ContentSlotView =>
  slot && {
    id: slot.definitionQualifiedName,
    domain: pagelet.domain,
    pageletIDs: slot.pageletIDs || [],
    ...createContentConfigurationParameterView(slot.configurationParameters || {}),
    displayName: slot.displayName,
  };

export const createContentPageletEntryPointView = (
  pageletEntryPoint: ContentPageletEntryPoint
): ContentPageletEntryPointView =>
  pageletEntryPoint && {
    id: pageletEntryPoint.id,
    domain: pageletEntryPoint.domain,
    resourceSetId: pageletEntryPoint.resourceSetId,
    displayName: pageletEntryPoint.displayName,
    pageletIDs: pageletEntryPoint.pageletIDs || [],
    ...createContentConfigurationParameterView(pageletEntryPoint.configurationParameters || {}),
    seoAttributes: pageletEntryPoint.seoAttributes,
  };
