import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

import { PreviewService } from './preview.service';

describe('Preview Service', () => {
  let previewService: PreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), provideRouter([])],
    });
    previewService = TestBed.inject(PreviewService);
  });

  it('should be created', () => {
    expect(previewService).toBeTruthy();
  });
});
