import b64u from 'b64u';

import { FacetData } from '../facet/facet.interface';
import { Facet } from '../facet/facet.model';
import { Filter } from '../filter/filter.model';

import { FilterNavigationData } from './filter-navigation.interface';
import { FilterNavigation } from './filter-navigation.model';

export class FilterNavigationMapper {
  static fromData(data: FilterNavigationData): FilterNavigation {
    return {
      filter:
        data && data.elements
          ? data.elements.map(filterData => ({
              id: filterData.id,
              name: filterData.name,
              displayType: filterData.displayType,
              facets: FilterNavigationMapper.mapFacetData(filterData.facets),
              selectionType: filterData.selectionType,
            }))
          : [],
    };
  }

  private static mapFacetData(facetDatas: FacetData[]) {
    return facetDatas
      ? facetDatas.map(facet => ({
          name: facet.name,
          count: facet.count,
          selected: facet.selected,
          displayName: facet.link.title,
          searchParameter: facet.link.uri.split(';SearchParameter=')[1],
        }))
      : [];
  }

  static fixSearchParameters(filterNavigation: FilterNavigation) {
    filterNavigation.filter.forEach(filter => {
      const selected = filter.facets
        .filter(facet => facet.selected)
        .map(facet =>
          filter.id.includes('Price') ? FilterNavigationMapper.fixPrice(filter.id, facet.searchParameter) : facet.name
        );
      filter.facets.forEach(facet => {
        if (filter.id.includes('Price')) {
          facet.name = FilterNavigationMapper.fixPrice(filter.id, facet.searchParameter);
        }
        FilterNavigationMapper.postProcess(filter, facet, selected);
      });
    });

    return filterNavigation;
  }

  private static fixPrice(filterId: string, searchParameter: string): string {
    const decodedSearchParams = b64u.decode(b64u.fromBase64(searchParameter));
    const params = FilterNavigationMapper.splitFormParams(decodedSearchParams);
    return params[filterId][0];
  }

  private static postProcess(filter: Filter, facet: Facet, selected: string[]): Facet {
    const decodedSearchParams = b64u.decode(b64u.fromBase64(facet.searchParameter));
    const paramsMap = FilterNavigationMapper.splitFormParams(decodedSearchParams);
    const isOr = filter.selectionType.endsWith('or');
    if (filter.selectionType === 'single') {
      if (facet.selected) {
        paramsMap[filter.id] = [];
      } else {
        paramsMap[filter.id] = [facet.name];
      }
    } else if (filter.selectionType.startsWith('multiple')) {
      if (facet.selected) {
        const newSelected = [...selected];
        newSelected.splice(newSelected.indexOf(facet.name), 1);
        paramsMap[filter.id] = newSelected;
      } else {
        paramsMap[filter.id] = [...selected, facet.name];
      }
    }
    facet.searchParameter = b64u.toBase64(
      b64u.encode(FilterNavigationMapper.mergeFormParams(paramsMap, isOr ? 'or' : 'and'))
    );
    return facet;
  }

  private static mergeFormParams(object, joiner: string): string {
    return (
      '&' +
      Object.entries(object)
        .filter(([, value]) => Array.isArray(value) && value.length)
        .map(([key, val]) => `${key}=${(val as string[]).join(`_${joiner}_`)}`)
        .join('&')
    );
  }

  private static splitFormParams(object: string) {
    return object
      ? object
          .split('&')
          .filter(x => !!x)
          .map(val => {
            const sp = val.split('=');
            return { key: sp[0], value: sp[1].split(',') };
          })
          .reduce((acc, val) => ({ ...acc, [val.key]: val.value }), {})
      : {};
  }
}
