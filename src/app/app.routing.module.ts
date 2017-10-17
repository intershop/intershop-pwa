import { Location } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LocalizeRouterLoader } from './services/router-parser-loader';
import { LocalizeRouterSettings } from './services/routes-parser-locale-currency/localize-router.config';
import { LocalizeRouterModule } from './services/routes-parser-locale-currency/localize-router.module';
import { LocalizeParser } from './services/routes-parser-locale-currency/localize-router.parser';

export function HttpLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings) {
  return new LocalizeRouterLoader(translate, location, settings);
}

const routes: Routes = [
  { path: '',   redirectTo: 'home', pathMatch: 'full'},
  { path: 'home',   component: HomePageComponent, data: { className: 'homepage' } }
];

@NgModule({
  imports: [
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

