import { TestBed } from '@angular/core/testing';

import { ServerSettingPipe } from './server-setting.pipe';

describe('Server Setting Pipe', () => {
  let serverSettingPipe: ServerSettingPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerSettingPipe],
    });
    serverSettingPipe = TestBed.inject(ServerSettingPipe);
  });

  it('should be created', () => {
    expect(serverSettingPipe).toBeTruthy();
  });

  it('should transform true to okay', () => {
    expect(serverSettingPipe.transform(true)).toEqual('test: okay');
  });

  it('should transform false to failed', () => {
    expect(serverSettingPipe.transform(false)).toEqual('test: failed');
  });
});
