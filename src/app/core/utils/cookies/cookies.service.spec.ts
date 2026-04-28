import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Request } from 'express';
import { noop } from 'rxjs';

import { REQUEST } from 'ish-core/utils/ssr/ssr.tokens';

import { CookiesService } from './cookies.service';

const mockDocument = () => ({
  cookie: undefined as string,
  getElementById: noop,
  querySelectorAll: jest.fn,
});

// ToDo: Refactor the cookies.service to make the secure flag testable again, e.g. by adding special functions, that can be mocked in the test.
describe('Cookies Service', () => {
  let cookiesService: CookiesService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
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

  it('should call put of underlying implementation and set cookie defaults', () => {
    cookiesService.put('foo', 'bar');
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de;SameSite=Strict"`);
  });

  it('should call get of underlying implementation', () => {
    cookiesService.put('foo', 'bar');
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de;SameSite=Strict"`);
    expect(cookiesService.get('foo')).toMatchInlineSnapshot(`"bar;path=/de;SameSite=Strict"`);
  });

  it('should call remove of underlying implementation', () => {
    cookiesService.put('foo', 'bar');
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de;SameSite=Strict"`);
    cookiesService.remove('foo');
    expect(document.cookie).toMatchInlineSnapshot(
      `"foo=;path=/de;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Strict"`
    );
  });

  // The cookies service cannot test the secure flag of the cookie, because jsdom does not support it.
  // eslint-disable-next-line jest/no-disabled-tests
  xit('should not set "secure" if protocoll is "http:"', () => {
    cookiesService.put('foo', 'bar');
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de;SameSite=Strict"`);
  });

  it('should set cookie defaults', () => {
    cookiesService.put('foo', 'bar');
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de;SameSite=Strict"`);
  });

  it('should set cookie secure false explicitly', () => {
    cookiesService.put('foo', 'bar', { secure: false });
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de;SameSite=Strict"`);
  });

  it('should set cookie "SameSite=None" explicitly', () => {
    cookiesService.put('foo', 'bar', { sameSite: 'None' });
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de;SameSite=None"`);
  });

  it('should set cookie "SameSite=Lax" and secure false explicitly', () => {
    cookiesService.put('foo', 'bar', { sameSite: 'Lax', secure: false });
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de;SameSite=Lax"`);
  });

  it('should set cookie expire time', () => {
    cookiesService.put('foo', 'bar', { expires: new Date(1234567890) });
    expect(document.cookie).toMatchInlineSnapshot(
      `"foo=bar;path=/de;expires=Thu, 15 Jan 1970 06:56:07 GMT;SameSite=Strict"`
    );
  });

  it('should set "SameSite=None" if PWA is run in iframe', () => {
    window.parent = Object.create(window);
    cookiesService.put('foo', 'bar');
    expect(document.cookie).toMatchInlineSnapshot(`"foo=bar;path=/de;SameSite=None"`);
  });
});
