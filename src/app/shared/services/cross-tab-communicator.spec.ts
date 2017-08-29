import { Observable } from 'rxjs/Rx';
import { TestBed, inject } from '@angular/core/testing';
import { HttpHeaders } from '@angular/common/http';
import { CrossTabCommunicator } from 'app/shared/services';

describe('cross tab communicator', () => {
  const tokenExists = true;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CrossTabCommunicator,
      ],
      imports: [
      ]
    });
  })

  it('should run set getSessionStorage data', inject([CrossTabCommunicator], (crossTabCommunicator: CrossTabCommunicator) => {
    sessionStorage.setItem('testdata', 'test');
    localStorage.setItem('getSessionStorage', Date.now().toString());
  }))

  it('should be able to subscribe event', inject([CrossTabCommunicator], (crossTabCommunicator: CrossTabCommunicator) => {
    sessionStorage.setItem('testdata', 'test');
    let count = 0;
    localStorage.setItem('getSessionStorage', Date.now().toString());
    crossTabCommunicator.subscribe('testEvent', (data: any) => {
            count++;
        });

    crossTabCommunicator.notify('testEvent', 1);
    expect(count).toEqual(0);
  }))
});
