import { CommonModule, Location } from '@angular/common';
import { Injector } from '@angular/core';
import { fakeAsync, getTestBed, TestBed, tick } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anyString, anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import {
  ALWAYS_SET_PREFIX,
  LocalizeRouterSettings
} from './localize-router.config';
import { LocalizeParser } from './localize-router.parser';


describe('LocalizeParser', () => {
  let injector: Injector;
  let loader: ManualParserLoader;
  let translate: TranslateService;
  let location: Location;
  let settings: LocalizeRouterSettings;

  let routes: Routes;
  let locales: any;
  let langs: string[];
  const prefix = 'PREFIX.';
  const translateServiceMock: any = mock(TranslateService);
  const locationMock: any = mock(Location);
  when(locationMock.path(anything())).thenReturn('');
  translateServiceMock.content = {
    'PREFIX.home': 'home_',
    'PREFIX.about': 'about_',
    'PREFIX.contact': 'contact_',
    'PREFIX.info': 'info_'
  };
  when(translateServiceMock.setDefaultLang(anyString())).thenReturn();
  when(translateServiceMock.getDefaultLang()).thenReturn('En');
  when(translateServiceMock.use(anyString())).thenCall((lang: string) => {
    return Observable.of(Object.keys(translateServiceMock.content).reduce((prev: any, key) => {
      prev[key] = translateServiceMock.content[key] + lang;
      return prev;
    }, {}));
  });
  when(translateServiceMock.get(anyString())).thenCall((input: string) => {
    return Observable.of(translateServiceMock.content[input] ? translateServiceMock.content[input] + 'en' : input);
  });
  when(translateServiceMock.getBrowserLang()).thenReturn('En');

  // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
  class ManualParserLoader extends LocalizeParser {
    constructor(translateService: TranslateService,
      locationService: Location,
      localizeRouterSettings: LocalizeRouterSettings,
      languages: string[],
      localesCollection: any,
      prefixes: string = 'ROUTES.',
      pattern: string = '{LANG}/{CURRENCY}') {
      super(translateService, locationService, localizeRouterSettings);
      this.langs = languages;
      this.localesCollection = localesCollection;
      this.prefix = prefixes || '';
      this.pattern = pattern;
    }

    load(route: Routes): Promise<any> {
      return new Promise((resolve: any) => {
        this.init(route).then(resolve);
      });
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
        { provide: Location, useFactory: () => instance(locationMock) },
        { provide: ALWAYS_SET_PREFIX, useValue: true },
        LocalizeRouterSettings
      ]
    });
    routes = [
      { path: '', redirectTo: 'some/path' },
      {
        path: 'some/path', children: [
          { path: '', redirectTo: 'nothing' },
          { path: 'else/:id', redirectTo: 'nothing/else' }
        ]
      }
    ];

    langs = ['en', 'de'];
    locales = [
      { 'lang': 'en', 'currency': 'USD', value: 'English', displayValue: 'en' },
      { 'lang': 'de', 'currency': 'EUR', value: 'German', displayValue: 'de' }
    ];

    injector = getTestBed();
    translate = injector.get(TranslateService);
    location = injector.get(Location);
    settings = injector.get(LocalizeRouterSettings);
    loader = new ManualParserLoader(translate, location, settings, langs, locales);
  });

  afterEach(() => {
    injector = undefined;
    translate = undefined;
    loader = undefined;
  });

  it('is defined', () => {
    expect(ManualParserLoader).toBeTruthy();
    expect(loader).toBeTruthy();
    expect(loader instanceof LocalizeParser).toEqual(true);
  });

  it('should set default language if not set', () => {
    expect(loader.langs).toEqual(['en', 'de']);
  });

  it('should extract language from url on getLocationLang', () => {
    loader = new ManualParserLoader(translate, location, settings, langs, locales, prefix);

    expect(loader.getLocationLang('/en/some/path/after')).toEqual('en');
    expect(loader.getLocationLang('de/some/path/after')).toEqual('de');
    expect(loader.getLocationLang('en')).toEqual('en');
    expect(loader.getLocationLang('en/')).toEqual('en');
    expect(loader.getLocationLang('/en')).toEqual('en');
    expect(loader.getLocationLang('/en/')).toEqual('en');
    expect(loader.getLocationLang('en?q=str')).toEqual('en');
    expect(loader.getLocationLang('en/?q=str')).toEqual('en');
    expect(loader.getLocationLang('/en?q=str')).toEqual('en');
    expect(loader.getLocationLang('/en/q=str')).toEqual('en');
  });

  it('should return null on getLocationLang if lang not found', () => {
    loader = new ManualParserLoader(translate, location, settings, locales, prefix);

    expect(loader.getLocationLang('/se/some/path/after')).toEqual(null);
    expect(loader.getLocationLang('rs/some/path/after')).toEqual(null);
    expect(loader.getLocationLang('')).toEqual(null);
    expect(loader.getLocationLang('/')).toEqual(null);
    expect(loader.getLocationLang('rs')).toEqual(null);
    expect(loader.getLocationLang('rs/')).toEqual(null);
    expect(loader.getLocationLang('/rs')).toEqual(null);
    expect(loader.getLocationLang('/rs/')).toEqual(null);
    expect(loader.getLocationLang('?q=str')).toEqual(null);
    expect(loader.getLocationLang('/?q=str')).toEqual(null);
    expect(loader.getLocationLang('rs?q=str')).toEqual(null);
    expect(loader.getLocationLang('rs/?q=str')).toEqual(null);
    expect(loader.getLocationLang('/rs?q=str')).toEqual(null);
    expect(loader.getLocationLang('/rs/q=str')).toEqual(null);
  });

  it('should call translateRoutes on init if languages passed', fakeAsync(() => {
    loader = new ManualParserLoader(translate, location, settings, langs, locales, prefix);
    spyOn(loader, 'translateRoutes').and.callThrough();

    loader.load([]);
    tick();
    expect(loader.translateRoutes).toHaveBeenCalled();
  }));

  it('should not call translateRoutes on init if no languages', fakeAsync(() => {
    loader = new ManualParserLoader(translate, location, settings, [], [], prefix);
    spyOn(loader, 'translateRoutes').and.callThrough();

    loader.load(routes);
    tick();
    expect(loader.translateRoutes).not.toHaveBeenCalled();
  }));
});
