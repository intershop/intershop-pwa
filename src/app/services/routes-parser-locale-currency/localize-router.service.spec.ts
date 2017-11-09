import { CommonModule, Location } from '@angular/common';
import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Event, NavigationEnd, NavigationStart, Router, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { anyString, anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { LocalizeRouterModule } from './localize-router.module';
import { LocalizeParser } from './localize-router.parser';
import { LocalizeRouterService } from './localize-router.service';

// tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
class FakeRouter {
  routes: Routes;
  fakeRouterEvents: Subject<Event> = new Subject<Event>();

  resetConfig = (routes: Routes) => {
    this.routes = routes;
  }

  get events(): Observable<Event> {
    return this.fakeRouterEvents;
  }

  parseUrl = () => '';
}

describe('LocalizeRouterService', () => {
  let injector: Injector;
  let parser: LocalizeParser;
  let router: Router;
  let localizeRouterService: LocalizeRouterService;
  let routes: Routes;
  let locales: any;
  let langs: string[];
  const locationMock: any = mock(Location);
  when(locationMock.path(anything())).thenReturn('');
  const translateServiceMock: any = mock(TranslateService);
  when(translateServiceMock.setDefaultLang(anyString())).thenReturn();
  when(translateServiceMock.use(anyString())).thenReturn();
  when(translateServiceMock.get(anyString())).thenReturn();
  when(translateServiceMock.getBrowserLang(anyString())).thenReturn('English');

  beforeEach(() => {
    routes = [
      { path: 'home', redirectTo: 'fakePath' },
      { path: 'home/about', redirectTo: 'fakePath' }
    ];

    langs = ['en', 'de'];
    locales = [
      { 'lang': 'en', 'currency': 'USD', value: 'English', displayValue: 'en' },
      { 'lang': 'de', 'currency': 'EUR', value: 'German', displayValue: 'de' }
    ];

    TestBed.configureTestingModule({
      imports: [CommonModule, LocalizeRouterModule.forRoot(routes)
      ],
      providers: [
        { provide: Router, useClass: FakeRouter },
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
        { provide: Location, useFactory: () => instance(locationMock) },
      ]
    });
    injector = getTestBed();
    parser = injector.get(LocalizeParser);
    router = injector.get(Router);

    localizeRouterService = new LocalizeRouterService(parser, router);
  });

  afterEach(() => {
    injector = void 0;
    localizeRouterService = void 0;
  });

  it('should be created', () => {
    expect(localizeRouterService).toBeTruthy();
    expect(localizeRouterService instanceof LocalizeRouterService).toBeTruthy();
  });

  it('should initialize routerEvents when created', () => {
    expect(localizeRouterService.routerEvents).toBeTruthy();
  });

  it('should reset route config on init', () => {
    expect((<any>router)['routes']).toEqual(void 0);
    parser.routes = routes;
    // tslint:disable-next-line:ban
    spyOn(router, 'resetConfig').and.callThrough();

    localizeRouterService.init();
    expect(router.resetConfig).toHaveBeenCalledWith(routes);
  });

  it('should translate route when received', () => {
    const testString = 'result/path';
    // tslint:disable-next-line:ban
    spyOn(parser, 'translateRoute').and.returnValue(testString);

    const res = localizeRouterService.translateRoute('my/path');
    expect(res).toEqual(testString);
    expect(parser.translateRoute).toHaveBeenCalledWith('my/path');
  });

  it('should append language if root route', () => {
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;

    const testString = '/my/path';
    // tslint:disable-next-line:ban
    spyOn(parser, 'translateRoute').and.returnValue(testString);

    const res = localizeRouterService.translateRoute(testString);
    expect(res).toEqual('/de' + testString);
    expect(parser.translateRoute).toHaveBeenCalledWith('/my/path');
  });

  it('should translate complex route when received', () => {
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;

    // tslint:disable-next-line:ban
    spyOn(parser, 'translateRoute').and.callFake((val: any) => val);

    const res = localizeRouterService.translateRoute(['/my/path', 123, 'about']);
    expect(res[0]).toEqual('/de/my/path');

    expect(parser.translateRoute).toHaveBeenCalledWith('/my/path');
    expect(parser.translateRoute).toHaveBeenCalledWith('about');
  });

  it('should translate routes if language had changed on route event', () => {
    localizeRouterService.init();
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;
    // tslint:disable-next-line:ban
    spyOn(parser, 'translateRoutes').and.returnValue(Observable.of(void 0));

    (<any>router).fakeRouterEvents.next(new NavigationStart(1, '/en/new/path'));
    expect(parser.translateRoutes).toHaveBeenCalledWith('en');
  });

  it('should not translate routes if language not found', () => {
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;
    // tslint:disable-next-line:ban
    spyOn(parser, 'translateRoutes').and.stub();

    (<any>router).fakeRouterEvents.next(new NavigationStart(1, '/bla/new/path'));
    expect(parser.translateRoutes).not.toHaveBeenCalled();
  });

  it('should not translate routes if language is same', () => {
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;
    // tslint:disable-next-line:ban
    spyOn(parser, 'translateRoutes').and.stub();

    (<any>router).fakeRouterEvents.next(new NavigationStart(1, '/de/new/path'));
    expect(parser.translateRoutes).not.toHaveBeenCalled();
  });

  it('should not translate routes if not NavigationStart', () => {
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;
    // tslint:disable-next-line:ban
    spyOn(parser, 'translateRoutes').and.stub();

    (<any>router).fakeRouterEvents.next(new NavigationEnd(1, '/en/new/path', '/en/new/path'));
    expect(parser.translateRoutes).not.toHaveBeenCalled();
  });
});

