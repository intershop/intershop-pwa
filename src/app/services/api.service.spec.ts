import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';

describe('API service test', () => {
  let mockJwtService = null;
  let mockHttpService = null;
  const mockLocalizeRouterService = null;
  let apiService: ApiService;

  beforeEach(() => {
    mockJwtService = {
      getToken: () => {
        return '123token456';
      }
    };

    mockHttpService = {
      get: (url: string, options: {}): Observable<any> => {
        return Observable.of({ 'type': 'get' });
      },
      put: (path: string, body: {}): Observable<any> => {
        return Observable.of({ 'type': 'put' });
      },
      post: (path: string, body: {}): Observable<any> => {
        return Observable.of({ 'type': 'post' });
      },
      delete: (path: string): Observable<any> => {
        return Observable.of({ 'type': 'delete' });
      },

    };
    apiService = new ApiService(mockHttpService, mockJwtService, mockLocalizeRouterService);
  });

  it('should return an observable on calling of GET().', () => {
    let returnVal;
    apiService.get('', null).subscribe((res) => {
      returnVal = res;
    });
    expect(returnVal.type).toBeTruthy();
  });

  it('should return an observable on calling of PUT().', () => {
    let returnVal;
    apiService.put('', null).subscribe((res) => {
      returnVal = res;
    });
    expect(returnVal.type).toEqual('put');
  });

  it('should return an observable on calling of POST().', () => {
    let returnVal;
    apiService.post('', null).subscribe((res) => {
      returnVal = res;
    });
    expect(returnVal.type).toEqual('post');
  });

  it('should return an observable on calling of DELETE().', () => {
    let returnVal;
    apiService.delete('').subscribe((res) => {
      returnVal = res;
    });
    expect(returnVal.type).toEqual('delete');
  });

});
