import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { QuotingFacade } from '../../facades/quoting.facade';

import { QuoteExpirationDateComponent } from './quote-expiration-date.component';

describe('Quote Expiration Date Component', () => {
  let component: QuoteExpirationDateComponent;
  let fixture: ComponentFixture<QuoteExpirationDateComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuoteExpirationDateComponent],
      providers: [{ provide: QuotingFacade, useFactory: () => instance(mock(QuotingFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteExpirationDateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
