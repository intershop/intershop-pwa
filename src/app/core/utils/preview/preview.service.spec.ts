import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock, when } from 'ts-mockito';

import { DesignViewService } from 'ish-core/utils/design-view/design-view.service';

import { PreviewService } from './preview.service';

describe('Preview Service', () => {
  let previewService: PreviewService;

  beforeEach(() => {
    const designViewServiceMock = mock(DesignViewService);
    when(designViewServiceMock.isDesignViewMode()).thenReturn(false);

    TestBed.configureTestingModule({
      providers: [
        { provide: DesignViewService, useFactory: () => instance(designViewServiceMock) },
        provideMockStore(),
        provideRouter([]),
      ],
    });
    previewService = TestBed.inject(PreviewService);
  });

  it('should be created', () => {
    expect(previewService).toBeTruthy();
  });
});
