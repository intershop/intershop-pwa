import {JwtService} from './jwt.service';
import {PLATFORM_ID} from '@angular/core';

describe('JWTService testing', () => {
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService(PLATFORM_ID);
  });

  it('should call saveToken function()', () => {
    const spy = spyOn(jwtService, 'saveToken').and.returnValue(true);
    jwtService.saveToken('rrr');
    expect(spy).toHaveBeenCalled();
  });

  xit('should call getToken function()', () => {
    const spy = spyOn(jwtService, 'getToken').and.callFake(() => {
      return '';
    });

    jwtService.getToken();
    expect(spy).toHaveBeenCalled();
  });

  xit('should call destroyToken function()', () => {
    const spy = spyOn(jwtService, 'destroyToken').and.callFake(() => {});
    jwtService.destroyToken();

    expect(spy).toHaveBeenCalled();
  });
});
