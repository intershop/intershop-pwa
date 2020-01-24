import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CookieLawModule } from 'angular2-cookie-law';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { coreReducers } from 'ish-core/store/core-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { AppComponent } from './app.component';
import { FooterComponent } from './shell/footer/footer/footer.component';
import { HeaderComponent } from './shell/header/header/header.component';

let translate: TranslateService;

describe('App Component', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent(FooterComponent),
        MockComponent(HeaderComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [
        CookieLawModule,
        NoopAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({ reducers: coreReducers }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render header component on page', async(() => {
    expect(findAllIshElements(element)).toContain('ish-header');
  }));
});
