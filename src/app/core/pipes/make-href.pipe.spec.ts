import { LocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { MakeHrefPipe } from './make-href.pipe';

describe('Make Href Pipe', () => {
  let makeHrefPipe: MakeHrefPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MakeHrefPipe],
    });
    makeHrefPipe = TestBed.inject(MakeHrefPipe);
  });

  it('should be created', () => {
    expect(makeHrefPipe).toBeTruthy();
  });

  it.each([
    [undefined, undefined, 'undefined'],
    ['/test', undefined, '/test'],
    ['/test', {}, '/test'],
    ['/test', { foo: 'bar' }, '/test;foo=bar'],
    ['/test', { foo: 'bar', marco: 'polo' }, '/test;foo=bar;marco=polo'],
    ['/test?query=q', undefined, '/test?query=q'],
    ['/test?query=q', {}, '/test?query=q'],
    ['/test?query=q', { foo: 'bar' }, '/test;foo=bar?query=q'],
    ['/test?query=q', { foo: 'bar', marco: 'polo' }, '/test;foo=bar;marco=polo?query=q'],
  ])(`should transform "%s" with %j to "%s"`, (url, params, expected) => {
    expect(makeHrefPipe.transform({ path: () => url } as LocationStrategy, params)).toEqual(expected);
  });
});
