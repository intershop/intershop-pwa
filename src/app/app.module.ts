import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from './components/breadcrumb/breadcrumb.service';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { CoreModule } from './modules/core.module';
import { PageModule } from './pages/pages.module';

@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'proof-of-concept'
    }),
    HttpClientModule,
    JsonpModule,
    AppRoutingModule,
    PageModule,
    CoreModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    BreadcrumbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
