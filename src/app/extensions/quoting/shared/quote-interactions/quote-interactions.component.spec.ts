import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { QuoteContextFacade } from '../../facades/quote-context.facade';

import { QuoteInteractionsComponent } from './quote-interactions.component';

describe('Quote Interactions Component', () => {
  let component: QuoteInteractionsComponent;
  let fixture: ComponentFixture<QuoteInteractionsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [QuoteInteractionsComponent],
      providers: [{ provide: QuoteContextFacade, useFactory: () => instance(mock(QuoteContextFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteInteractionsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
