import { MockApiService, CustomErrorHandler } from './';
import { HttpClient } from '@angular/common/http';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';

describe('MockApiService', () => {
  let mockApiService: MockApiService;
  let httpClient: HttpClient;
  let customErrorHandler: CustomErrorHandler;

  beforeEach(() => {
    httpClient = mock(HttpClient);
    customErrorHandler = mock(CustomErrorHandler);

    mockApiService = new MockApiService(instance(httpClient), null, instance(customErrorHandler));
  });

  it('should confirm that getMockPath returns correct path for mock json file', () => {
    const mockPath = mockApiService.getMockPath('Cutomers');
    expect(mockPath).toBe('/assets/mock-data/Cutomers/get-data.json');
  });

  it('should return true when path is not to be excluded as per configSettings', () => {
    mockApiService.configSettings = {
      exlcudePath: ['categories'],
      mockAllRequest: true
    };
    const toBeMocked = mockApiService.pathHasToBeMocked('Cutomers');
    expect(toBeMocked).toBe(true);
  });

  it('should return false when path to be excluded as per configSettings', () => {
    mockApiService.configSettings = {
      exlcudePath: ['categories'],
      mockAllRequest: true
    };
    const toBeMocked = mockApiService.pathHasToBeMocked('categories');
    expect(toBeMocked).toBe(false);
  });
});
