import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { first, tap } from 'rxjs/operators';

import { ICMIdentityProvider } from './identity-provider/icm.identity-provider';
import { IDENTITY_PROVIDER_IMPLEMENTOR, IdentityProviderFactory } from './identity-provider/identity-provider.factory';
import { getIdentityProvider } from './store/core/configuration';
import { whenTruthy } from './utils/operators';

export function identityProviderFactoryInitializer(store: Store, identityProviderFactory: IdentityProviderFactory) {
  return () =>
    store
      .pipe(
        select(getIdentityProvider),
        whenTruthy(),
        first(),
        tap(config => identityProviderFactory.init(config))
      )
      .toPromise();
}

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: identityProviderFactoryInitializer,
      deps: [Store, IdentityProviderFactory],
      multi: true,
    },
    {
      provide: IDENTITY_PROVIDER_IMPLEMENTOR,
      multi: true,
      useValue: {
        type: 'ICM',
        implementor: ICMIdentityProvider,
      },
    },
  ],
})
export class IdentityProviderModule {}
