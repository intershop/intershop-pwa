import { TestBed, inject } from '@angular/core/testing';

import { CategoriesService } from './categories.service';
import { Http } from '@angular/http';

describe('CategoriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesService]
    }).overrideProvider(CategoriesService, {
      useValue: {},
    });
  });

  it('should be created', inject([CategoriesService], (service: CategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
