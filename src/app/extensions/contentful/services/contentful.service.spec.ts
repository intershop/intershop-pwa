import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { ContentfulConfig } from '../models/contentfulConfig.model';

import { ContentfulService } from './contentful.service';

describe('Contentful Service', () => {
  let statePropertiesService: StatePropertiesService;
  let contentfulService: ContentfulService;

  beforeEach(() => {
    statePropertiesService = mock(StatePropertiesService);
    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: StatePropertiesService, useFactory: () => instance(statePropertiesService) }],
    });
    contentfulService = TestBed.inject(ContentfulService);

    when(statePropertiesService.getStateOrEnvOrDefault<ContentfulConfig>('CONTENTFUL', 'contentful')).thenReturn(
      of({
        apiUrl: '',
        spaceId: '',
        accessToken: '',
        environment: 'master',
      })
    );
  });

  it('should be created', () => {
    expect(contentfulService).toBeTruthy();
  });
});
