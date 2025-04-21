import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RESPONSE } from '../../../../express.tokens';
import { noop } from 'rxjs';
import { anyNumber, spy, verify } from 'ts-mockito';

import { HttpStatusCodeService } from './http-status-code.service';
import { provideRouter } from '@angular/router';

describe('Http Status Code Service', () => {
  let httpStatusCodeService: HttpStatusCodeService;
  let RES: { status(status: number): void };
  let resSpy: { status(status: number): void };
  let location: Location;

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
        imports: [
          provideRouter([
            { path: 'error', children: [] },
            { path: 'maintenance', children: [] },
          ]),
        ],
      });
      httpStatusCodeService = TestBed.inject(HttpStatusCodeService);
      location = TestBed.inject(Location);
    });

    it('should be created', () => {
      expect(httpStatusCodeService).toBeTruthy();
    });

    describe('setStatus', () => {
      it('should do nothing for normal status', fakeAsync(() => {
        httpStatusCodeService.setStatus(204);
        tick(500);
        verify(resSpy.status(anyNumber())).never();
        expect(location.path()).toBeEmpty();
      }));

      it('should do nothing for normal errors', fakeAsync(() => {
        httpStatusCodeService.setStatus(404);
        tick(500);
        verify(resSpy.status(anyNumber())).never();
        expect(location.path()).toBeEmpty();
      }));

      it('should redirect to error page for server errors', fakeAsync(() => {
        httpStatusCodeService.setStatus(500);
        tick(500);
        verify(resSpy.status(anyNumber())).never();
        expect(location.path()).toEqual('/error');
      }));

      it('should redirect to maintenance page for server 503 errors (Unavailable)', fakeAsync(() => {
        httpStatusCodeService.setStatus(503);
        tick(500);
        verify(resSpy.status(anyNumber())).never();
        expect(location.path()).toEqual('/maintenance');
      }));
    });
  });

  describe.onSSREnvironment('on server', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          provideRouter([
            { path: 'error', children: [] },
            { path: 'maintenance', children: [] },
          ]),
        ],
        providers: [{ provide: RESPONSE, useValue: RES }],
      });
      httpStatusCodeService = TestBed.inject(HttpStatusCodeService);
      location = TestBed.inject(Location);
    });

    it('should be created', () => {
      expect(httpStatusCodeService).toBeTruthy();
    });

    describe('setStatus', () => {
      it('should set status for normal status', fakeAsync(() => {
        httpStatusCodeService.setStatus(204);
        tick(500);
        verify(resSpy.status(204)).once();
        expect(location.path()).toBeEmpty();
      }));

      it('should set status and redirect for normal errors', fakeAsync(() => {
        httpStatusCodeService.setStatus(404);
        tick(500);
        verify(resSpy.status(404)).once();
        expect(location.path()).toEqual('/error');
      }));

      it('should redirect to error page for server errors', fakeAsync(() => {
        httpStatusCodeService.setStatus(500);
        tick(500);
        verify(resSpy.status(500)).once();
        expect(location.path()).toEqual('/error');
      }));

      it('should redirect to maintenance page for server 503 errors (Unavailable)', fakeAsync(() => {
        httpStatusCodeService.setStatus(503);
        tick(500);
        verify(resSpy.status(503)).once();
        expect(location.path()).toEqual('/maintenance');
      }));
    });
  });
});
