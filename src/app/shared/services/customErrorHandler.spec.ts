import {CustomErrorHandler} from './customErrorHandler';

describe('CustomErrorHandler test', () => {
  let customError: CustomErrorHandler;

  beforeEach(() => {
    customError = new CustomErrorHandler();
  });

  it('should test for the handleError console output', () => {
    spyOn(console, 'log');
    customError.handleError({'message': 'error'});

    expect(console.log).toHaveBeenCalledWith('error');
  });

  it('should test for the handleAPIError console output', () => {
    spyOn(console, 'log');
    customError.handleApiErrors({'status': 'error', 'statusText': 'status'});

    expect(console.log).toHaveBeenCalledWith('error and status');
  });

  it('should test for null observable when call handleAPIError', () => {
    customError.handleApiErrors({'status': 'error', 'statusText': 'status'})
      .subscribe((retVal) => {
      expect(retVal).toBeNull();
      });
  });


});
