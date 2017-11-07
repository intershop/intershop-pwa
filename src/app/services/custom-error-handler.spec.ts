import {CustomErrorHandler} from './custom-error-handler';

describe('CustomErrorHandler test', () => {
  let customError: CustomErrorHandler;

  beforeEach(() => {
    customError = new CustomErrorHandler();
  });

  it('should log the message when received', () => {
    // tslint:disable-next-line:ban
    spyOn(console, 'log');
    customError.handleError({'message': 'error'});

    expect(console.log).toHaveBeenCalledWith('error');
  });

  it('should log the status and statusText when received', () => {
    // tslint:disable-next-line:ban
    spyOn(console, 'log');
    customError.handleApiErrors({'status': 'error', 'statusText': 'status'});

    expect(console.log).toHaveBeenCalledWith('error and status');
  });

  it('should return an observable on receiving status', () => {
    customError.handleApiErrors({'status': 'error', 'statusText': 'status'})
      .subscribe((retVal) => {
      expect(retVal).toEqual('error and status');
      });
  });
});
