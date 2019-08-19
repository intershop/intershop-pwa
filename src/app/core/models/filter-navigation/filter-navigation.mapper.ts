import { FacetData } from '../facet/facet.interface';

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
}
