import { TestBed } from '@angular/core/testing';

import { MultiSiteService } from './multi-site.service';

describe('Multi Site Service', () => {
  let multiSiteService: MultiSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    multiSiteService = TestBed.inject(MultiSiteService);
  });

  it('should be created', () => {
    expect(multiSiteService).toBeTruthy();
  });
  it('should return url unchanged if no language baseHref exists', () => {
    expect(multiSiteService.getLangUpdatedUrl('de_DE', '/testpath', '/')).toMatchInlineSnapshot(`"/testpath"`);
  });
  it('should return with new url if language baseHref exists and language is valid', () => {
    expect(multiSiteService.getLangUpdatedUrl('en_US', '/de/testpath', '/de')).toMatchInlineSnapshot(`"/en/testpath"`);
  });
  it('should return url unchanged if language baseHref exists but language is invalid', () => {
    expect(multiSiteService.getLangUpdatedUrl('xy_XY', '/de/testpath', '/de')).toMatchInlineSnapshot(`"/de/testpath"`);
  });
});
