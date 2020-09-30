import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { QuotingFacade } from '../../facades/quoting.facade';
import { Quote } from '../../models/quoting/quoting.model';

import { QuoteListPageComponent } from './quote-list-page.component';
import { QuoteListComponent } from './quote-list/quote-list.component';

describe('Quote List Page Component', () => {
  let component: QuoteListPageComponent;
  let fixture: ComponentFixture<QuoteListPageComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async () => {
    quotingFacade = mock(QuotingFacade);
    await TestBed.configureTestingModule({
      declarations: [MockComponent(LoadingComponent), MockComponent(QuoteListComponent), QuoteListPageComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: QuotingFacade, useFactory: () => instance(quotingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteListPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if quotes loading', () => {
    when(quotingFacade.loading$).thenReturn(of(true));

    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render quote list component if quotes present', () => {
    const quotes = [{ id: 'test' }] as Quote[];
    when(quotingFacade.quotingEntities$()).thenReturn(of(quotes));

    fixture.detectChanges();
    expect(element.querySelector('ish-quote-list')).toBeTruthy();
  });
});
