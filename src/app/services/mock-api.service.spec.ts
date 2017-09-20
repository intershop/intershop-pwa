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

    mockApiService = new MockApiService();
  });

  it('should return the correct path for mock json file', () => {
    const mockPath = mockApiService.getMockPath('Cutomers');
    expect(mockPath).toBe('/assets/mock-data/Cutomers/get-data.json');
  });

  describe('matchPath', () => {

    it('should find \'categories\' in [categories]', () => {
      expect(mockApiService.matchPath('categories', ['categories'])).toBe(true);
    });

    it('should not find \'catego\' in [categories]', () => {
      expect(mockApiService.matchPath('catego', ['categories'])).toBe(false);
    });

    it('should find \'categories\' in [cat.*]', () => {
      expect(mockApiService.matchPath('categories', ['cat.*'])).toBe(true);
    });

    it('should not find \'categories/Computers\' in [categories]', () => {
      expect(mockApiService.matchPath('categories/Computers', ['categories'])).toBe(false);
    });

    it('should find \'categories/Computers\' in [categories.*]', () => {
      expect(mockApiService.matchPath('categories/Computers', ['categories.*'])).toBe(true);
    });

    it('should find \'categories/Computers\' in [categories/.*]', () => {
      expect(mockApiService.matchPath('categories/Computers', ['categories/.*'])).toBe(true);
    });

    it('should find \'categories/Computers\' in [categories/Computers]', () => {
      expect(mockApiService.matchPath('categories/Computers', ['categories/Computers'])).toBe(true);
    });

    it('should not find \'categories/Computers\' in [categories/Audio]', () => {
      expect(mockApiService.matchPath('categories/Computers', ['categories/Audio'])).toBe(false);
    });

    it('should not find \'categories/Computers\' in [categories/]', () => {
      expect(mockApiService.matchPath('categories/Computers', ['categories/'])).toBe(false);
    });

    it('should find \'categories/Computers\' in [categories/(Audio|Computers|HiFi)]', () => {
      expect(mockApiService.matchPath('categories/Computers', ['categories/(Audio|Computers|HiFi)'])).toBe(true);
    });

    it('should not find \'categories/Computers\' in [categories/(Audio|Computers|HiFi)/]', () => {
      expect(mockApiService.matchPath('categories/Computers', ['categories/(Audio|Computers|HiFi)/'])).toBe(false);
    });
  });
});
