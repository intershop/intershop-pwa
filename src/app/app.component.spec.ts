import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { mock, instance, when } from 'ts-mockito';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import { MockComponent } from './components/mock.component';
import { BreadcrumbService } from './components/breadcrumb/breadcrumb.service';
import { GlobalState } from './services';
import { Observable } from 'rxjs/Rx';
import { LocalizeRouterService } from './services/routes-parser-locale-currency/localize-router.service';

let translate: TranslateService;

describe('AppComponent', () => {
  const globalStateStub = {
    breadcrumbPages: ['/family', '/category']
  };
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
        { provide: GlobalState, useValue: globalStateStub },
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

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should match the text passed in Header Component', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('is-header').textContent).toEqual('Header Component');
  }));

  it('should call ngOnInit and showBreadcrumbs should be true', () => {
    when(routerMock.events).thenReturn(Observable.of(new NavigationEnd(2, '/category/Computers', '/category/Computers')));
    fixture.detectChanges();

    expect(fixture.componentInstance.showBreadCrumb).toBe(true);
  });

  it('should call ngOnInit and showBreadcrumbs should be false', () => {
    when(routerMock.events).thenReturn(Observable.of(new NavigationEnd(2, '/login', 'login')));
    fixture.detectChanges();

    expect(fixture.componentInstance.showBreadCrumb).toBe(false);
  });
});

