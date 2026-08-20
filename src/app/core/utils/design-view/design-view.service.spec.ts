import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { MultiSiteService } from 'ish-core/utils/multi-site/multi-site.service';

import { DesignViewService } from './design-view.service';

describe('Design View Service', () => {
  let designViewService: DesignViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MultiSiteService, useFactory: () => instance(mock(MultiSiteService)) },
        provideMockStore({
          selectors: [{ selector: getCurrentLocale, value: 'en_US' }],
        }),
      ],
    });
    designViewService = TestBed.inject(DesignViewService);
  });

  it('should be created', () => {
    expect(designViewService).toBeTruthy();
  });
});
