import { TestBed } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { CookiesService as ForeignCookiesService } from 'ngx-utils-cookies-port';
import { anything, instance, mock, verify } from 'ts-mockito';

import { CookiesService } from './cookies.service';

describe('Cookies Service', () => {
  let cookiesService: CookiesService;
  let foreignCookiesServiceMock: ForeignCookiesService;

  beforeEach(() => {
    foreignCookiesServiceMock = mock(ForeignCookiesService);
    TestBed.configureTestingModule({
      imports: [BrowserTransferStateModule],
      providers: [{ provide: ForeignCookiesService, useFactory: () => instance(foreignCookiesServiceMock) }],
    });
    cookiesService = TestBed.inject(CookiesService);
  });

  it('should be created', () => {
    expect(cookiesService).toBeTruthy();
  });

  it('should call get of underlying implementation', () => {
    cookiesService.get('dummy');
    verify(foreignCookiesServiceMock.get('dummy')).once();
  });

  it('should call remove of underlying implementation', () => {
    cookiesService.remove('dummy');
    verify(foreignCookiesServiceMock.remove('dummy')).once();
  });

  it('should call put of underlying implementation', () => {
    cookiesService.put('dummy', 'value');
    verify(foreignCookiesServiceMock.put('dummy', anything(), anything())).once();
  });
});
