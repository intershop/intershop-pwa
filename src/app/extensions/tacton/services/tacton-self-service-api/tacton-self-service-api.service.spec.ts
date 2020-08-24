import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { TactonSelfServiceApiConfiguration } from '../../models/tacton-self-service-api-configuration/tacton-self-service-api-configuration.model';
import { getSelfServiceApiConfiguration } from '../../store/tacton-config';

import { TactonSelfServiceApiService } from './tacton-self-service-api.service';

describe('Tacton Self Service Api Service', () => {
  let tactonSelfServiceApiService: TactonSelfServiceApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: getSelfServiceApiConfiguration,
              value: {
                endPoint: 'http://example.com/self-service',
                apiKey: 'ASDF',
              } as TactonSelfServiceApiConfiguration,
            },
          ],
        }),
      ],
    });
    tactonSelfServiceApiService = TestBed.inject(TactonSelfServiceApiService);
  });

  it('should be created', () => {
    expect(tactonSelfServiceApiService).toBeTruthy();
  });
});
