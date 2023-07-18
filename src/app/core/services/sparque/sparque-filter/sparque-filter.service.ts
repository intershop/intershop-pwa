/* eslint-disable ish-custom-rules/ban-imports-file-pattern */
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, forkJoin, map, switchMap } from 'rxjs';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { SparqueOptionsResponse } from 'ish-core/models/sparque/sparque.interface';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { DEFINED_FACETS, SparqueApiService } from 'ish-core/services/sparque/sparque-api/sparque-api.service';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Injectable({ providedIn: 'root' })
export class SparqueFilterService extends FilterService {
  private sparqueApiService = inject(SparqueApiService);

  getFilterForCategory(_categoryUniqueId: string): Observable<FilterNavigation> {
    return EMPTY;
  }

  getFilterForSearch(searchTerm: string): Observable<FilterNavigation> {
    return this.sparqueApiService
      .getRelevantInformation$()
      .pipe(switchMap(([basketSKUs, userId, locale]) => this.getAllFilters$(searchTerm, locale, userId, basketSKUs)));
  }

  applyFilter(searchParameter: URLFormParams): Observable<FilterNavigation> {
    return this.sparqueApiService
      .getRelevantInformation$()
      .pipe(
        switchMap(([basketSKUs, userId, locale]) =>
          this.getAllFilters$(
            searchParameter.searchTerm ? searchParameter.searchTerm[0] : '',
            locale,
            userId,
            basketSKUs,
            searchParameter
          )
        )
      );
  }

  private getAllFilters$(
    searchTerm: string,
    locale: string,
    userId: string,
    basketSKUs: string[],
    searchParameter?: URLFormParams
  ): Observable<FilterNavigation> {
    const appliedFilterPath = searchParameter ? SparqueApiService.getAppliedFilterPath(searchParameter) : '';
    return forkJoin([
      ...DEFINED_FACETS.map(facet =>
        this.sparqueApiService
          .get<SparqueOptionsResponse>(
            `${SparqueApiService.getSearchPath(
              searchTerm,
              locale,
              userId,
              basketSKUs
            )}${appliedFilterPath}/options/${facet}`
          )
          .pipe(map(resp => this.mapDefinedFacets(resp, searchParameter)))
      ),
    ]).pipe(
      map(filters => filters.flat()),
      map(filter => ({
        filter,
      }))
    );
  }

  private mapDefinedFacets(resp: SparqueOptionsResponse, searchParameter: URLFormParams): Filter {
    // eslint-disable-next-line ish-custom-rules/no-object-literal-type-assertion
    return {
      id: resp.id,
      name: resp.title,
      displayType: 'text_clear',
      selectionType: 'multiple_or',
      limitCount: 5,
      facets: resp.options?.map(opt => {
        const id = opt.id;
        const selected = !!searchParameter && !!searchParameter[resp.id]?.find(v => v === id);
        // DONT ASK
        const newFacetOptions = searchParameter?.[resp.id]?.filter(v => v !== id);
        const { [resp.id]: _id, ...searchParametersWithoutFilterId } = searchParameter ?? {
          [resp.id]: [],
        };
        const searchParametersWithoutFilterFacetOption = {
          ...searchParametersWithoutFilterId,
          ...(newFacetOptions?.length ? { [resp.id]: newFacetOptions } : {}),
        };

        return {
          name: id,
          displayName: opt.value,
          count: parseInt(opt.title),
          level: 0,
          selected,
          searchParameter: {
            ...searchParametersWithoutFilterFacetOption,
            ...(!selected ? { [resp.id]: [id] } : {}),
          },
          mappedType: 'text',
          mappedValue: id,
        };
      }),
    } as Filter;
  }
}
