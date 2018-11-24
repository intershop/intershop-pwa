import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { Quote } from '../../../models/quote/quote.model';

import { QuoteStateComponent } from './quote-state.component';

describe('Quote State Component', () => {
  let fixture: ComponentFixture<QuoteStateComponent>;
  let component: QuoteStateComponent;
  let element: HTMLElement;

  const timestamp = 1000;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteStateComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteStateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.quote = {} as Quote;

    jest.spyOn(Date, 'now').mockImplementation(() => timestamp);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display new state if quote state is New', () => {
    component.quote = {
      state: 'New',
    } as QuoteRequest;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.new');
  });

  it('should display submitted state if quote state is submitted', () => {
    component.quote = {
      state: 'Submitted',
    } as QuoteRequest;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.submitted');
  });

  it('should display new expired if quote state is Responded and validToDate < current date', () => {
    component.quote = {
      state: 'Responded',
      validToDate: timestamp - 1,
    } as Quote;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.expired');
  });

  it('should display new responded if quote state is Responded and validToDate > current date', () => {
    component.quote = {
      state: 'Responded',
      validToDate: timestamp + 1,
    } as Quote;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.responded');
  });

  it('should display rejected state if quote state is Rejected', () => {
    component.quote = {
      state: 'Rejected',
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.rejected');
  });

  it('should display unknown state if no quote state is set', () => {
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.unknown');
  });
});
