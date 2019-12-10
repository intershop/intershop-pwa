import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CookiesService as ForeignCookiesService } from '@ngx-utils/cookies';
import { anything, instance, mock, verify } from 'ts-mockito';

import { CookiesService } from './cookies.service';

describe('Cookies Service', () => {
  let cookiesService: CookiesService;
  let foreignCookiesServiceMock: ForeignCookiesService;

  beforeEach(() => {
    foreignCookiesServiceMock = mock(ForeignCookiesService);
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ForeignCookiesService, useFactory: () => instance(foreignCookiesServiceMock) },
      ],
    });
    cookiesService = TestBed.get(CookiesService);
  });

  it('should be created', () => {
    expect(cookiesService).toBeTruthy();
  });

  it('should call get of underlying implementation', () => {
    cookiesService.get('dummy');
    verify(foreignCookiesServiceMock.get('dummy')).once();
  });

  it('should call remove of underlying implementation', done => {
    setTimeout(() => {
      cookiesService.remove('dummy');
      verify(foreignCookiesServiceMock.remove('dummy')).once();
      done();
    }, 2000);
  });

  it('should call put of underlying implementation', done => {
    setTimeout(() => {
      cookiesService.put('dummy', 'value');
      verify(foreignCookiesServiceMock.put('dummy', anything(), anything())).once();
      done();
    }, 2000);
  });
});
