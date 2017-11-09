import { ChangeDetectorRef, Injector } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { anyString, instance, mock, when } from 'ts-mockito';
import { equals, LocalizeRouterPipe } from './localize-router.pipe';
import { LocalizeRouterService } from './localize-router.service';

describe('LocalizeRouterPipe', () => {
  let injector: Injector;
  let localizePipe: LocalizeRouterPipe;
  let mockedRef: any;
  let ref: any;
  const localizeRouterServiceMock: any = mock(LocalizeRouterService);
  const mockLocalizeRouterService = instance(localizeRouterServiceMock);
  mockLocalizeRouterService.routerEvents = new Subject<string>();
  when(localizeRouterServiceMock.translateRoute(anyString())).thenCall((route: string) => {
    return route + '_TR';
  });

  beforeEach(() => {
    injector = getTestBed();
    mockedRef = mock(ChangeDetectorRef);
    ref = instance(mockedRef);
    localizePipe = new LocalizeRouterPipe(mockLocalizeRouterService, ref);
  });

  afterEach(() => {
    injector = undefined;
    localizePipe = undefined;
  });

  it('should be created', () => {
    expect(localizePipe).toBeTruthy();
    expect(localizePipe instanceof LocalizeRouterPipe).toBeTruthy();
  });

  it('should translate a route when called', () => {
    mockLocalizeRouterService.parser.currentLang = 'en';

    expect(localizePipe.transform('route')).toEqual('route_TR');
  });

  it('should translate a multi segment route when called', () => {
    mockLocalizeRouterService.parser.currentLang = 'en';

    expect(localizePipe.transform('path/to/my/route')).toEqual('path/to/my/route_TR');
  });

  it('should translate a complex segment route if it changed', () => {
    mockLocalizeRouterService.parser.currentLang = 'en';
    // tslint:disable-next-line:ban
    spyOn(ref, 'markForCheck').and.callThrough();

    localizePipe.transform(['/path', null, 'my', 5]);
    ref.markForCheck.calls.reset();

    localizePipe.transform(['/path', 4, 'my', 5]);
    expect(ref.markForCheck).toHaveBeenCalled();
  });

  it('should not translate a complex segment route if it`s not changed', () => {
    mockLocalizeRouterService.parser.currentLang = 'en';
    // tslint:disable-next-line:ban
    spyOn(ref, 'markForCheck').and.callThrough();

    localizePipe.transform(['/path', 4, 'my', 5]);
    ref.markForCheck.calls.reset();

    localizePipe.transform(['/path', 4, 'my', 5]);
    expect(ref.markForCheck).not.toHaveBeenCalled();
  });

  it('should call markForChanges when it translates a string', () => {
    mockLocalizeRouterService.parser.currentLang = 'en';
    // tslint:disable-next-line:ban
    spyOn(ref, 'markForCheck').and.callThrough();

    localizePipe.transform('route');
    expect(ref.markForCheck).toHaveBeenCalled();
  });

  it('should not call markForChanges when query is not string', () => {
    mockLocalizeRouterService.parser.currentLang = 'en';
    // tslint:disable-next-line:ban
    spyOn(ref, 'markForCheck').and.callThrough();

    localizePipe.transform(null);
    expect(ref.markForCheck).not.toHaveBeenCalled();
  });

  it('should not call markForChanges when query is empty string', () => {
    mockLocalizeRouterService.parser.currentLang = 'en';
    // tslint:disable-next-line:ban
    spyOn(ref, 'markForCheck').and.callThrough();

    localizePipe.transform('');
    expect(ref.markForCheck).not.toHaveBeenCalled();
  });

  it('should not call markForChanges when no language selected', () => {
    mockLocalizeRouterService.parser.currentLang = null;
    // tslint:disable-next-line:ban
    spyOn(ref, 'markForCheck').and.callThrough();

    localizePipe.transform('route');
    expect(ref.markForCheck).not.toHaveBeenCalled();
  });

  it('should not call markForChanges if same route already translated', () => {
    mockLocalizeRouterService.parser.currentLang = 'en';
    // tslint:disable-next-line:ban
    spyOn(ref, 'markForCheck').and.callThrough();
    localizePipe.transform('route');
    localizePipe.transform('route');
    expect(ref.markForCheck.calls.count()).toEqual(1);
  });

  it('should subscribe to service`s routerEvents when emitted', () => {
    const query = 'MY_TEXT';
    mockLocalizeRouterService.parser.currentLang = 'en';
    // tslint:disable-next-line:ban
    spyOn(localizePipe, 'transform').and.callThrough();
    // tslint:disable-next-line:ban
    spyOn(ref, 'markForCheck').and.callThrough();

    localizePipe.transform(query);
    ref.markForCheck.calls.reset();
    (<any>localizePipe.transform)['calls'].reset();

    mockLocalizeRouterService.parser.currentLang = 'de';
    mockLocalizeRouterService.routerEvents.next('de');
    expect(localizePipe.transform).toHaveBeenCalled();
    expect(ref.markForCheck).toHaveBeenCalled();
  });

  describe('\'Equal method\'', () => {
    it('should return true if same object', () => {
      let a;
      let b;
      a = b = {
        something: true
      };
      const c = 'something else';

      expect(equals(a, b)).toBe(true);
      expect(equals(a, c)).toBe(false);
    });
    it('should return false if one of inputs is null', () => {
      let a;
      let b;
      a = {
        something: true
      };
      b = null;

      expect(equals(a, b)).toBe(false);
      expect(equals(b, a)).toBe(false);
    });
    it('should return true if both are NaN', () => {
      let a;
      let b;
      a = NaN;
      b = NaN;

      expect(equals(a, b)).toBe(true);
    });
    it('should return false if type is different', () => {
      expect(equals(null, 0)).toBe(false);
      expect(equals(null, '')).toBe(false);
      expect(equals(0, false)).toBe(false);
      expect(equals('1', 1)).toBe(false);
      expect(equals('1', '1')).toBe(true);
    });
    it('should return false if only one is Array', () => {
      expect(equals([], {})).toBe(false);
      expect(equals({}, [])).toBe(false);
    });
    it('should return false if array length is different', () => {
      expect(equals([], [1])).toBe(false);
    });
    it('should return false if array elements are different', () => {
      expect(equals([1, 3, 2], [1, 2, 3])).toBe(false);
    });
    it('should return true if array elements are same', () => {
      expect(equals([1, 2, 3], [1, 2, 3])).toBe(true);
    });
    it('should return false if keys dont match', () => {
      expect(equals({ text: 123, same: 1 }, { text: 321, same: 1 })).toBe(false);
      expect(equals({ text: 123 }, { non_text: 123 })).toBe(false);
      expect(equals({ text: 123 }, { text: 123, non_text: 123 })).toBe(false);
      expect(equals({ text: 123, same: 1 }, { text: 123, same: 1 })).toBe(true);
    });
    it('should ignore if inherited fields dont match', () => {
      // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
      class Class1 {
        same: boolean;

        first() {
        }

        constructor() {
        }
      }

      // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
      class Class2 {
        same: boolean;

        second() {
        }

        constructor() {
        }
      }

      const instance1: any = new Class1();
      instance1.same = true;
      const instance2: any = new Class2();
      instance2.same = true;

      expect(equals(instance1, instance2)).toBe(true);
    });
  });

});


