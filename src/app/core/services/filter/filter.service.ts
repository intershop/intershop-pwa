import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  SparqueFacetOptionsResponse,
  SparqueFacetResponse,
  SparqueOptionsResponse,
} from 'src/app/extensions/sparque/models/sparque/sparque.interface';
import { DEFINED_FACETS, SparqueApiService } from 'src/app/extensions/sparque/services/sparque-api/sparque-api.service';

import { CategoryHelper } from 'ish-core/models/category/category.model';
import { FilterNavigationData } from 'ish-core/models/filter-navigation/filter-navigation.interface';
import { FilterNavigationMapper } from 'ish-core/models/filter-navigation/filter-navigation.mapper';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { omit } from 'ish-core/utils/functions';
import { URLFormParams, appendFormParamsToHttpParams } from 'ish-core/utils/url-form-params';

//import e = require('express');
@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(
    private apiService: ApiService,
    private filterNavigationMapper: FilterNavigationMapper,
    private featureToggle: FeatureToggleService,
    private sparqueApiService: SparqueApiService
  ) {}

  getFilterForCategory(categoryUniqueId: string): Observable<FilterNavigation> {
    const category = CategoryHelper.getCategoryPath(categoryUniqueId);
    return this.apiService
      .get<FilterNavigationData>(`categories/${category}/productfilters`, { sendSPGID: true })
      .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }

  getFilterForSearch(searchTerm: string): Observable<FilterNavigation> {
    if (this.featureToggle.enabled('sparque')) {
      return this.sparqueApiService
        .getRelevantInformation$()
        .pipe(switchMap(([basketSKUs, userId, locale]) => this.getAllFilters$(searchTerm, locale, userId, basketSKUs)));
    } else {
      return this.apiService
        .get<FilterNavigationData>(`productfilters`, {
          sendSPGID: true,
          params: new HttpParams().set('searchTerm', searchTerm),
        })
        .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
    }
  }

  getFilterForMaster(masterSKU: string): Observable<FilterNavigation> {
    return this.apiService
      .get<FilterNavigationData>(`productfilters`, {
        sendSPGID: true,
        params: new HttpParams().set('MasterSKU', masterSKU),
      })
      .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }

  applyFilter(searchParameter: URLFormParams): Observable<FilterNavigation> {
    if (this.featureToggle.enabled('sparque')) {
      return this.sparqueApiService
        .getRelevantInformation$()
        .pipe(
          switchMap(([basketSKUs, userId, locale]) =>
            this.getAllFilters$(searchParameter.searchTerm[0], locale, userId, basketSKUs, searchParameter)
          )
        );
    } else {
      const params = appendFormParamsToHttpParams(omit(searchParameter, 'category'));

      const resource = searchParameter.category
        ? `categories/${searchParameter.category[0]}/productfilters`
        : 'productfilters';

      return this.apiService
        .get<FilterNavigationData>(resource, { params })
        .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
    }
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
          .pipe(
            map(
              resp =>
                // eslint-disable-next-line ish-custom-rules/no-object-literal-type-assertion
                ({
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
                      displayName: opt.title,
                      count: opt.score,
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
                } as Filter)
            )
          )
      ),
      this.sparqueApiService
        .get<SparqueFacetResponse>(
          `${SparqueApiService.getSearchPath(searchTerm, locale, userId, basketSKUs)}${
            appliedFilterPath ?? ''
          }/e/facets/results?config=default`
        )
        .pipe(
          switchMap(resp =>
            forkJoin(
              resp?.items?.map(item =>
                this.sparqueApiService
                  .get<SparqueFacetOptionsResponse>(
                    `${SparqueApiService.getSearchPath(searchTerm, locale, userId, basketSKUs)}${
                      appliedFilterPath ?? ''
                    }/e/facet_options/p/attribute/${
                      item?.tuple[0]?.id.split('propertyName/')[1]
                    }/results?config=default&count=200`
                  )
                  .pipe(
                    map(options => {
                      const id = item?.tuple[0]?.id.split('propertyName/')[1];
                      // eslint-disable-next-line ish-custom-rules/no-object-literal-type-assertion
                      return {
                        id,
                        name:
                          item?.tuple[0]?.attributes.name ??
                          item?.tuple[0]?.attributes.identifier ??
                          item?.tuple[0]?.id,
                        displayType: 'text_clear',
                        selectionType: 'multiple_or',
                        limitCount: 5,
                        facets: options?.items?.map(opt => {
                          const name = opt.tuple[0];
                          const selected = !!searchParameter && !!searchParameter[id]?.find(v => v === name);
                          const newFacetOptions = searchParameter?.[id]?.filter(v => v !== name);
                          const { [id]: _id, ...searchParametersWithoutFilterId } = searchParameter ?? {
                            [id]: [],
                          };
                          const searchParametersWithoutFilterFacetOption = {
                            ...searchParametersWithoutFilterId,
                            ...(newFacetOptions?.length ? { [id]: newFacetOptions } : {}),
                          };
                          return {
                            name,
                            displayName: name,
                            count: opt.probability,
                            level: 0,
                            selected,
                            searchParameter: {
                              ...searchParametersWithoutFilterFacetOption,
                              ...(!selected ? { [id]: [name] } : {}),
                            },
                            mappedType: 'text',
                            mappedValue: name,
                          };
                        }),
                      } as Filter;
                    })
                  )
              )
            )
          )
        ),
    ]).pipe(
      map(filters => filters.flat().filter(filter => filter.facets.length)),
      map(filter => ({
        filter,
      }))
    );
  }
}
