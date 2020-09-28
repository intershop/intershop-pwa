import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { QuotingFacade } from '../../facades/quoting.facade';

import { QuoteStateComponent } from './quote-state.component';

describe('Quote State Component', () => {
  let fixture: ComponentFixture<QuoteStateComponent>;
  let component: QuoteStateComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuoteStateComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: QuotingFacade, useFactory: () => instance(mock(QuotingFacade)) }],
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
