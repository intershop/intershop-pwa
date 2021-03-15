import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { noop } from 'rxjs';

import { CookiesService } from './cookies.service';

const mockDocument = () => ({
  cookie: undefined as string,
  getElementById: noop,
});

describe('Cookies Service', () => {
  let cookiesService: CookiesService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserTransferStateModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/de' },
        { provide: DOCUMENT, useFactory: mockDocument },
      ],
    });

    cookiesService = TestBed.inject(CookiesService);
    document = TestBed.inject(DOCUMENT);
  });

  it('should be created', () => {
    expect(cookiesService).toBeTruthy();
  });

  it('should call get of underlying implementation', () => {
    cookiesService.put('foo', 'bar');
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de"`);
    expect(cookiesService.get('foo')).toMatchInlineSnapshot(`"bar;path=/de"`);
  });

  it('should call remove of underlying implementation', () => {
    cookiesService.put('foo', 'bar');
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de"`);
    cookiesService.remove('foo');
    expect(document.cookie).toMatchInlineSnapshot(`"foo=;path=/de;expires=Thu, 01 Jan 1970 00:00:00 GMT"`);
  });

  it('should call put of underlying implementation', () => {
    cookiesService.put('foo', 'bar');
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de"`);
  });
});
