import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { QuotingFacade } from '../../facades/quoting.facade';

import { QuoteStateComponent } from './quote-state.component';

describe('Quote State Component', () => {
  let fixture: ComponentFixture<QuoteStateComponent>;
  let component: QuoteStateComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteStateComponent],
      providers: [
        { provide: QuotingFacade, useFactory: () => instance(mock(QuotingFacade)) },
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteStateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
