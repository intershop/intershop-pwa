import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getCurrentLocale } from 'ish-core/store/core/configuration';

import { DesignViewService } from './design-view.service';

describe('Design View Service', () => {
  let designViewService: DesignViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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
