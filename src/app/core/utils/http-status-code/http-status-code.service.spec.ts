import { Location } from '@angular/common';
import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { noop } from 'rxjs';
import { anyNumber, spy, verify } from 'ts-mockito';

import { HttpStatusCodeService } from './http-status-code.service';

describe('Http Status Code Service', () => {
  let httpStatusCodeService: HttpStatusCodeService;
  let RES: { status(status: number): void };
  let resSpy;
  let location: Location;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    RES = {
      status: noop,
    };
    resSpy = spy(RES);
    httpStatusCodeService = undefined;
    location = undefined;
  });

  describe('on browser', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DummyComponent],
        imports: [RouterTestingModule.withRoutes([{ path: 'error', component: DummyComponent }])],
        providers: [{ provide: RESPONSE, useValue: RES }, { provide: PLATFORM_ID, useValue: 'browser' }],
      });
      httpStatusCodeService = TestBed.get(HttpStatusCodeService);
      location = TestBed.get(Location);
    });

    it('should be created', () => {
      expect(httpStatusCodeService).toBeTruthy();
    });

    describe('setStatus', () => {
      it('should do nothing on browser side', fakeAsync(() => {
        httpStatusCodeService.setStatus(404);
        tick(500);
        verify(resSpy.status(anyNumber())).never();
        expect(location.path()).toBeEmpty();
      }));
    });

    describe('setStatusAndRedirect', () => {
      it('should only redirect on browser side', fakeAsync(() => {
        httpStatusCodeService.setStatusAndRedirect(404);
        tick(500);
        verify(resSpy.status(anyNumber())).never();
        expect(location.path()).toEqual('/error');
      }));
    });
  });

  describe('on server', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DummyComponent],
        imports: [RouterTestingModule.withRoutes([{ path: 'error', component: DummyComponent }])],
        providers: [{ provide: RESPONSE, useValue: RES }, { provide: PLATFORM_ID, useValue: 'server' }],
      });
      httpStatusCodeService = TestBed.get(HttpStatusCodeService);
      location = TestBed.get(Location);
    });

    it('should be created', () => {
      expect(httpStatusCodeService).toBeTruthy();
    });

    describe('setStatus', () => {
      it('should set status on server side', fakeAsync(() => {
        httpStatusCodeService.setStatus(404);
        tick(500);
        verify(resSpy.status(404)).once();
        expect(location.path()).toBeEmpty();
      }));
    });

    describe('setStatusAndRedirect', () => {
      it('should perform all actions on server side', fakeAsync(() => {
        httpStatusCodeService.setStatusAndRedirect(404);
        tick(500);
        verify(resSpy.status(404)).once();
        expect(location.path()).toEqual('/error');
      }));
    });
  });
});
