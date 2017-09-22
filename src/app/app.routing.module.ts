import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalizeRouterModule } from './services/routes-parser-locale-currency/localize-router.module';
import { LocalizeParser } from './services/routes-parser-locale-currency/localize-router.parser';
import { LocalizeRouterLoader } from './services/router-parser-loader';
import { LocalizeRouterSettings } from './services/routes-parser-locale-currency/localize-router.config';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { HomePageModule } from './pages/home-page/home-page.module';

export function HttpLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings) {
  return new LocalizeRouterLoader(translate, location, settings);
}

const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    HomePageModule,
    RouterModule.forRoot(routes),
    LocalizeRouterModule.forRoot(routes, {
      parser: {
        provide: LocalizeParser,
        useFactory: HttpLoaderFactory,
        deps: [TranslateService, Location, LocalizeRouterSettings]
      },
    }),
  ],
  exports: [RouterModule, LocalizeRouterModule]
})

export class AppRoutingModule {

}

