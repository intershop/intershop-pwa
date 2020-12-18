import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { range } from 'lodash-es';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { QuotingFacade } from '../../facades/quoting.facade';
import { Quote } from '../../models/quoting/quoting.model';

import { QuoteWidgetComponent } from './quote-widget.component';

describe('Quote Widget Component', () => {
  let component: QuoteWidgetComponent;
  let fixture: ComponentFixture<QuoteWidgetComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async () => {
    quotingFacade = mock(QuotingFacade);
    when(quotingFacade.quotingEntities$()).thenReturn(of([]));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(InfoBoxComponent), MockComponent(LoadingComponent), QuoteWidgetComponent],
      providers: [{ provide: QuotingFacade, useFactory: () => instance(quotingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if quotes or quoteRequests loading', () => {
    when(quotingFacade.loading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should calculate and display the right amounts when rendered', () => {
    when(quotingFacade.quotingEntities$()).thenReturn(
      of(range(1, 6).map(num => (({ id: `${num}` } as unknown) as Quote)))
    );
    when(quotingFacade.state$('1')).thenReturn(of('New'));
    when(quotingFacade.state$('2')).thenReturn(of('Rejected'));
    when(quotingFacade.state$('3')).thenReturn(of('Submitted'));
    when(quotingFacade.state$('4')).thenReturn(of('Responded'));
    when(quotingFacade.state$('5')).thenReturn(of('Expired'));

    fixture.detectChanges();

    const respondedCounter = element.querySelector('[data-testing-id="responded-counter"]');
    const submittedCounter = element.querySelector('[data-testing-id="submitted-counter"]');
    expect(respondedCounter.textContent.trim()).toEqual('1');
    expect(submittedCounter.textContent.trim()).toEqual('1');
  });
});
