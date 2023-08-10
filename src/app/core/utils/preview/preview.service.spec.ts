import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { PreviewService } from './preview.service';

describe('Preview Service', () => {
  let previewService: PreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideMockStore()],
    });
    previewService = TestBed.inject(PreviewService);
  });

  it('should be created', () => {
    expect(previewService).toBeTruthy();
  });
});
