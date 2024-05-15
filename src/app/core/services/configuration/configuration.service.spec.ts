import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ContentConfigurationParameterMapper } from 'ish-core/models/content-configuration-parameter/content-configuration-parameter.mapper';
import { ApiService } from 'ish-core/services/api/api.service';
import { LocalizationsService } from 'ish-core/services/localizations/localizations.service';

import { ConfigurationService } from './configuration.service';

describe('Configuration Service', () => {
  let apiServiceMock: ApiService;
  let contentConfigurationParameterMapperMock: ContentConfigurationParameterMapper;
  let localizationsServiceMock: LocalizationsService;
  let configurationService: ConfigurationService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    localizationsServiceMock = mock(LocalizationsService);
    contentConfigurationParameterMapperMock = mock(ContentConfigurationParameterMapper);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ContentConfigurationParameterMapper,
          useFactory: () => instance(contentConfigurationParameterMapperMock),
        },
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        { provide: LocalizationsService, useFactory: () => instance(localizationsServiceMock) },
      ],
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
