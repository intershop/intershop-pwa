import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { ConfigurationService } from './configuration.service';

describe('Configuration Service', () => {
  let apiServiceMock: ApiService;
  let configurationService: ConfigurationService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    configurationService = TestBed.inject(ConfigurationService);
  });

  it('should be created', () => {
    expect(configurationService).toBeTruthy();
  });

  it("should get the server configuration when 'getServerConfiguration' is called", done => {
    when(apiServiceMock.get(`configurations`, anything())).thenReturn(of({}));

    configurationService.getServerConfiguration().subscribe(() => {
      verify(apiServiceMock.get(`configurations`, anything())).once();
      done();
    });
  });
});
