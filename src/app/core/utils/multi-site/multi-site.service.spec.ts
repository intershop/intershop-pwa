import { LocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { instance, mock, when } from 'ts-mockito';

import { MultiSiteService } from './multi-site.service';

describe('Multi Site Service', () => {
  let mockLocation: LocationStrategy;
  let location: LocationStrategy;
  let multiSiteService: MultiSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    multiSiteService = TestBed.inject(MultiSiteService);
    mockLocation = mock(LocationStrategy);
    location = instance(mockLocation);
  });

  it('should be created', () => {
    expect(multiSiteService).toBeTruthy();
  });
  it('should return url unchanged if no language baseHref exists', () => {
    when(mockLocation.getBaseHref).thenReturn(() => '/');
    when(mockLocation.path).thenReturn(() => '/testpath');
    expect(multiSiteService.getLangUpdatedUrl('de_DE', location)).toMatchInlineSnapshot(`"/testpath"`);
  });
  it('should return with new url if language baseHref exists and language is valid', () => {
    when(mockLocation.getBaseHref).thenReturn(() => '/de');
    when(mockLocation.path).thenReturn(() => '/de/testpath');
    expect(multiSiteService.getLangUpdatedUrl('en_US', location)).toMatchInlineSnapshot(`"/en/testpath"`);
  });
  it('should return url unchanged if language baseHref exists but language is invalid', () => {
    when(mockLocation.getBaseHref).thenReturn(() => '/de');
    when(mockLocation.path).thenReturn(() => '/de/testpath');
    expect(multiSiteService.getLangUpdatedUrl('xy_XY', location)).toMatchInlineSnapshot(`"/de/testpath"`);
  });
});
