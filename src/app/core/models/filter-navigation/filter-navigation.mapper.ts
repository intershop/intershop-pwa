import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import b64u from 'b64u';

import { Facet } from 'ish-core/models/facet/facet.model';
import { FilterData, FilterValueMap } from 'ish-core/models/filter/filter.interface';
import { Filter } from 'ish-core/models/filter/filter.model';
import { getICMStaticURL } from 'ish-core/store/configuration';
import { formParamsToString, stringToFormParams } from 'ish-core/utils/url-form-params';

import { FilterNavigationData } from './filter-navigation.interface';
import { FilterNavigation } from './filter-navigation.model';

@Injectable({ providedIn: 'root' })
export class FilterNavigationMapper {
  private icmStaticURL: string;

  constructor(store: Store<{}>) {
    store.pipe(select(getICMStaticURL)).subscribe(url => (this.icmStaticURL = url));
  }

  fromData(data: FilterNavigationData): FilterNavigation {
    return {
      filter:
        data && data.elements
          ? data.elements.map(filterData => ({
              id: filterData.id,
              name: filterData.name,
              displayType: filterData.displayType,
              facets: this.mapFacetData(filterData),
              filterValueMap: this.parseFilterValueMap(filterData.filterValueMap),
              selectionType: filterData.selectionType || 'single',
            }))
          : [],
    };
  }

  /**
   * parse ish-link to
   */
  private parseFilterValueMapUrl(url: string) {
    const urlParts = url.split(':');
    return `${this.icmStaticURL}/${urlParts[0]}/-${urlParts[1]}`;
  }

  /**
   * parse FilterValueMap for image-links
   */
  private parseFilterValueMap(filterValueMap: FilterValueMap): FilterValueMap {
    return filterValueMap
      ? Object.keys(filterValueMap).reduce((acc, k) => {
          acc[k] = {
            mapping:
              filterValueMap[k].type === 'image'
                ? `url(${this.parseFilterValueMapUrl(filterValueMap[k].mapping)})`
                : filterValueMap[k].mapping,
            type: filterValueMap[k].type,
          };
          return acc;
        }, {})
      : {};
  }

  private mapFacetData(filterData: FilterData) {
    return filterData.facets
      ? filterData.facets.reduce((acc, facet) => {
          if (facet.name !== 'Show all') {
            acc.push({
              name: facet.name,
              count: facet.count,
              selected: facet.selected,
              displayName: facet.link.title,
              searchParameter: facet.link.uri.split(';SearchParameter=')[1],
              level: facet.level || 0,
            });
          } else {
            console.warn(`Limiting filters is not supported. Set limit to -1 in the BackOffice (${filterData.name})`);
          }
          return acc;
        }, [])
      : [];
  }

  fixSearchParameters(filterNavigation: FilterNavigation) {
    filterNavigation.filter.forEach(filter => {
      filter.id = filter.id.replace(/\ /g, '+');
      const selected = filter.facets
        .filter(facet => facet.selected)
        .map(facet => (filter.id.includes('Price') ? this.fixPrice(filter.id, facet.searchParameter) : facet.name));
      filter.facets.forEach(facet => {
        facet.name = facet.name.replace(/\ /g, '+');
        if (filter.id.includes('Price')) {
          facet.name = this.fixPrice(filter.id, facet.searchParameter);
        }
        this.postProcess(filter, facet, selected);
      });
    });

    return filterNavigation;
  }

  private fixPrice(filterId: string, searchParameter: string): string {
    const decodedSearchParams = b64u.decode(b64u.fromBase64(searchParameter));
    const params = stringToFormParams(decodedSearchParams);
    return params[filterId][0];
  }

  private postProcess(filter: Filter, facet: Facet, selected: string[]): Facet {
    const decodedSearchParams = b64u.decode(b64u.fromBase64(facet.searchParameter));
    const paramsMap = stringToFormParams(decodedSearchParams);
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
    facet.searchParameter = b64u.toBase64(b64u.encode('&' + formParamsToString(paramsMap, isOr ? '_or_' : '_and_')));
    return facet;
  }
}
