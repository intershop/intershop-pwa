import { inject, TestBed } from '@angular/core/testing';
import { CrossTabCommunicator } from './cross-tab-communicator';

describe('cross tab communicator', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CrossTabCommunicator,
      ],
      imports: [
      ]
    });
  });

  it('should run set getSessionStorage data', inject([CrossTabCommunicator], (crossTabCommunicator: CrossTabCommunicator) => {
    sessionStorage.setItem('testdata', 'test');
    localStorage.setItem('getSessionStorage', Date.now().toString());
  }));

  it('should be able to subscribe event', inject([CrossTabCommunicator], (crossTabCommunicator: CrossTabCommunicator) => {
    sessionStorage.setItem('testdata', 'test');
    let count = 0;
    localStorage.setItem('getSessionStorage', Date.now().toString());
    crossTabCommunicator.subscribe('testEvent', (data: any) => {
            count++;
        });

    crossTabCommunicator.notify('testEvent', 1);
    expect(count).toEqual(0);
  }));
});
