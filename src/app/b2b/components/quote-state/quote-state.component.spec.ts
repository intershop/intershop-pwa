import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteStateComponent } from './quote-state.component';

describe('Quote State Component', () => {
  let fixture: ComponentFixture<QuoteStateComponent>;
  let component: QuoteStateComponent;
  let element: HTMLElement;

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
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display new state if quote state is 0', () => {
    component.quote = {
      state: 0,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.new');
  });

  it('should display submitted state if quote state is 3', () => {
    component.quote = {
      state: 3,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.submitted');
  });

  it('should display new expired if quote state is 4 and validToDate < current date', () => {
    component.quote = {
      state: 4,
      validToDate: new Date().getTime() - 1000,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.expired');
  });

  it('should display new responded if quote state is 4 and validToDate > current date', () => {
    component.quote = {
      state: 4,
      validToDate: new Date().getTime() + 1000,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.responded');
  });

  it('should display submitted state if quote state is 5', () => {
    component.quote = {
      state: 5,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.submitted');
  });

  it('should display confirmed state if quote state is 6', () => {
    component.quote = {
      state: 6,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.confirmed');
  });

  it('should display confirmed state and modified state if quote state is 6 and modified is set', () => {
    component.quote = {
      state: 6,
      modified: new Date().getTime(),
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.confirmed');
    expect(element.textContent).toContain('quote.state.modified');
  });

  it('should display accepted state if quote state is 7', () => {
    component.quote = {
      state: 7,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.accepted');
  });

  it('should display accepted state and expired state if quote state is 7 and validToDate < current date', () => {
    component.quote = {
      state: 7,
      validToDate: new Date().getTime() - 1000,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.accepted');
    expect(element.textContent).toContain('quote.state.expired');
  });

  it('should display auto_accepted state if quote state is 8', () => {
    component.quote = {
      state: 8,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.auto_accepted');
  });

  it('should display auto_accepted state and expired state if quote state is 8 and validToDate < current date', () => {
    component.quote = {
      state: 8,
      validToDate: new Date().getTime() - 1000,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.auto_accepted');
    expect(element.textContent).toContain('quote.state.expired');
  });

  it('should display rejected state if quote state is 9', () => {
    component.quote = {
      state: 9,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.rejected');
  });

  it('should display cancelled state if quote state is 10', () => {
    component.quote = {
      state: 10,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.cancelled');
  });

  it('should display cancelled state if quote state is 11', () => {
    component.quote = {
      state: 11,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.cancelled');
  });

  it('should display closed state if quote state is 12', () => {
    component.quote = {
      state: 12,
    } as Quote;
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.closed');
  });

  it('should display unknown state if no quote state is set', () => {
    fixture.detectChanges();

    expect(element.textContent).toContain('quote.state.unknown');
  });
});
