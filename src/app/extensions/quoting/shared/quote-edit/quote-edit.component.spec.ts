import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { QuoteContextFacade } from '../../facades/quote-context.facade';

import { QuoteEditComponent } from './quote-edit.component';

describe('Quote Edit Component', () => {
  let fixture: ComponentFixture<QuoteEditComponent>;
  let component: QuoteEditComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    const context = mock(QuoteContextFacade);
    when(context.select('entityAsQuoteRequest')).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [QuoteEditComponent],
      providers: [{ provide: QuoteContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
