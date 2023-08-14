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
    // return this.sparqueApiService.getRelevantInformation$().pipe(() =>
    //   //this.sparqueApiService
    //   //  .get<SparqueSearchWrapperResponse>(
    //   //    `api/v2/search?Keyword=${searchTerm}&WorkspaceName=intershop-obi&ApiName=PWA&Locale=en-US`
    //       `${SparqueApiService.getSearchPath(
    //           searchTerm,
    //           locale,
    //           userId,
    //           basketSKUs
    //         )}${appliedFilterPath}/results,count?count=${amount}&offset=${offset}`
    //     )
    //     //this.sparqueApiService.get<SparqueResponse>('e/sorting/results?config=default'),
    //     // this.store.pipe(select(getCurrentLocale))
    //     .pipe(map(resp => this.mapDefinedWrapperFacets(resp)))
    // );

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

  /* private mapDefinedWrapperFacets(resp: SparqueSearchWrapperResponse): FilterNavigation {
    // eslint-disable-next-line ish-custom-rules/no-object-literal-type-assertion
    //forkJoin([
    console.log('entries', resp.fixedFacetsList);
    console.log('entries', Object.entries(resp.fixedFacetsList));
    console.log('entries', Object.entries(resp.fixedFacetsList));
    return {
      filter: Object.entries(resp.fixedFacetsList).map(([key, facet]) =>
      { name: key,
        id: key,
        selectionType: 'multiple_or',
        displayType: 'text_clear',
        limitCount: 5,
        facets: [], //facet.options?.map(opt => {opt.title})
      })
    };
  }*/

  /*resp.fixedFacetsList.map(facet => ({
        name: facet.id,
        id: facet.id,
        selectionType: 'multiple_or',
        displayType: 'text_clear',
        limitCount: 5,
        facets: [], //facet.options?.map(opt => {opt.title})
      })),*

  /*return resp.fixedFacetsList.map(
        facet =>
          ({
            name: facet.id,
            id: facet.id,
            selectionType: 'multiple_or',
            displayType: 'text_clear',
            limitCount: 5,
            facets: [], //facet.options?.map(opt => {opt.title})
          } as Filter)
      ),*/
  /*]).pipe(
      map(filters => filters.flat()),
      map(filter => ({
        filter,
      }))
    );
  }*/
  /* return {
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
  }*/
}
