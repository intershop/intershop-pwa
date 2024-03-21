import { ApplicationRef, Injectable, InjectionToken, Injector, ViewContainerRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { firstValueFrom, of, switchMap, take, takeUntil } from 'rxjs';

import { getFeatures } from 'ish-core/store/core/configuration';
import { getDefaultInstantSearchQuery } from 'ish-core/store/core/viewconf';
import { FeatureToggleService, FeatureToggleType } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { whenTruthy } from 'ish-core/utils/operators';

export interface InstantSearchContext {
  query: string;
  componentProvider: InstantSearchComponentProvider;
  activated: boolean;
}

export interface InstantSearchComponentProvider {
  feature(): FeatureToggleType;
  renderComponent(anchor: ViewContainerRef): Promise<void>;
}

export const INSTANTSEARCH_COMPONENT_PROVIDER = new InjectionToken<InstantSearchComponentProvider>(
  'instantSearchComponentProvider'
);

@Injectable({ providedIn: 'root' })
export class InstantSearchFacade extends RxState<InstantSearchContext> {
  constructor(injector: Injector, store: Store, appRef: ApplicationRef, featureToggleService: FeatureToggleService) {
    super();

    this.connect('query', store.pipe(select(getDefaultInstantSearchQuery)));

    this.connect(
      store.pipe(
        select(getFeatures),
        whenTruthy(),
        switchMap(() => {
          const instantSearchProviders = injector
            .get<InstantSearchComponentProvider[]>(INSTANTSEARCH_COMPONENT_PROVIDER, [])
            .filter(mod => featureToggleService.enabled(mod.feature()));

          if (instantSearchProviders.length > 0) {
            return of({
              activated: true,
              componentProvider: instantSearchProviders[0],
            });
          } else {
            return of({
              activated: false,
            });
          }
        }),
        takeUntil(appRef.isStable.pipe(whenTruthy()))
      )
    );
  }

  async renderComponent(anchor: ViewContainerRef) {
    const provider = await firstValueFrom(this.select('componentProvider').pipe(whenTruthy(), take(1)));
    await provider.renderComponent(anchor);
  }
}
