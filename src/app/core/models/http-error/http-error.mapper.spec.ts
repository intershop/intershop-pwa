import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { HttpErrorMapper } from './http-error.mapper';

describe('Http Error Mapper', () => {
  it('should convert correctly for simple HttpErrorResponse', () => {
    expect(
      HttpErrorMapper.fromError(new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }))
    ).toMatchSnapshot();
  });
  it('should convert correctly for HttpErrorResponse with headers', () => {
    expect(
      HttpErrorMapper.fromError(
        new HttpErrorResponse({
          status: 500,
          headers: new HttpHeaders().set('key1', 'value1').set('key2', 'value2'),
        })
      )
    ).toMatchSnapshot();
  });
});
