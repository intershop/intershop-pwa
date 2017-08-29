import { Observable } from 'rxjs/Rx';
import { TestBed, inject } from '@angular/core/testing';
import { EventAggregator } from 'app/shared/event-aggregator';

describe('event aggregator', () => {
  const tokenExists = true;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventAggregator,
      ],
      imports: [
      ]
    });
  })

  it('should fire event', inject([EventAggregator], (eventAggregator: EventAggregator) => {
    let called = false;
    eventAggregator.registerEvent('testevent', (data: any) => {
      called = true;
    });

    eventAggregator.fireEvent('testevent', null);
    expect(called).toEqual(true);
  }))

});
