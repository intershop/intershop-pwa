import { Facet } from '../facet/facet.model';
import { Filter } from '../filter/filter.model';

import { FilterNavigationData } from './filter-navigation.interface';
import { FilterNavigation } from './filter-navigation.model';

export class FilterNavigationMapper {
  static fromData(data: FilterNavigationData): FilterNavigation {
    return {
      filter: data.elements.map(
        filterData =>
          ({
            id: filterData.id,
            name: filterData.name,
            displayType: filterData.displayType,
            facets: filterData.facets.map(
              facetData =>
                ({
                  name: facetData.name,
                  type: facetData.type,
                  count: facetData.count,
                  selected: facetData.selected,
                  link: facetData.link,
                  filterId: facetData.link.uri.split('/filters/')[1].split(';')[0],
                  searchParameter: facetData.link.uri.split(';SearchParameter=')[1],
                } as Facet)
            ),
          } as Filter)
      ),
    };
  }
}
