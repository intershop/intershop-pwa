import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';
import { instance, mock, when } from 'ts-mockito';
import { AppComponent } from './app.component';
import { BreadcrumbService } from './components/breadcrumb/breadcrumb.service';
import { MockComponent } from './components/mock.component';
import { LocalizeRouterService } from './services/routes-parser-locale-currency/localize-router.service';

let translate: TranslateService;

describe('AppComponent', () => {
  let breadcrumbServiceMock: BreadcrumbService;
  let localizeRouterServiceMock: LocalizeRouterService;
  let routerMock: Router;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent({ selector: 'is-header', template: 'Header Component' }),
        MockComponent({ selector: 'is-footer', template: 'Footer Component' }),
        MockComponent({ selector: 'is-breadcrumb', template: 'BreadCrumb' })
      ],
      providers: [
        TranslateService,
        { provide: BreadcrumbService, useFactory: () => instance(breadcrumbServiceMock) },
        { provide: Router, useFactory: () => instance(routerMock) },
        {provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) }
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    breadcrumbServiceMock = mock(BreadcrumbService);
    routerMock = mock(Router);
    localizeRouterServiceMock = mock(LocalizeRouterService);
    translate = TestBed.get(TranslateService);
    fixture = TestBed.createComponent(AppComponent);

    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  });

  it('should be created', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  // tslint:disable-next-line:meaningful-naming-in-tests
  it('should match the text passed in Header Component', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('is-header').textContent).toEqual('Header Component');
  }));
  // tslint:disable-next-line:meaningful-naming-in-tests
  it('should call ngOnInit and showBreadcrumbs should be true', () => {
    when(routerMock.events).thenReturn(Observable.of(new NavigationEnd(2, '/category/Computers', '/category/Computers')));
    fixture.detectChanges();

    expect(fixture.componentInstance.showBreadCrumb).toBe(true);
  });
  // tslint:disable-next-line:meaningful-naming-in-tests
  it('should call ngOnInit and showBreadcrumbs should be false', () => {
    when(routerMock.events).thenReturn(Observable.of(new NavigationEnd(2, '/login', 'login')));
    fixture.detectChanges();

    expect(fixture.componentInstance.showBreadCrumb).toBe(false);
  });
});

