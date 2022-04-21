import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { CMSService } from 'ish-core/services/cms/cms.service';
import { ContentStoreModule } from 'ish-core/store/content/content-store.module';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { loadPagelet, loadPageletSuccess } from './pagelets.actions';
import { PageletsEffects } from './pagelets.effects';

describe('Pagelets Effects', () => {
  let actions$: Observable<Action>;
  let effects: PageletsEffects;
  let cmsServiceMock: CMSService;

  beforeEach(() => {
    cmsServiceMock = mock(CMSService);

    TestBed.configureTestingModule({
      imports: [ContentStoreModule.forTesting('pagelets'), CoreStoreModule.forTesting()],
      providers: [
        { provide: CMSService, useFactory: () => instance(cmsServiceMock) },
        PageletsEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(PageletsEffects);
  });

  describe('loadPagelet$', () => {
    it('should dispatch success actions when encountering loadPagelet', () => {
      when(cmsServiceMock.getPagelet(anything())).thenReturn(of({ id: '1' } as ContentPagelet));

      actions$ = hot('-a-a-a', { a: loadPagelet({ pageletId: '1' }) });
      const expected$ = cold('-c-c-c', {
        c: loadPageletSuccess({
          pagelet: { id: '1' } as ContentPagelet,
        }),
      });

      expect(effects.loadPagelet$).toBeObservable(expected$);
    });
  });
});
