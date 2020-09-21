import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteStateComponent } from '../quote-state/quote-state.component';

import { QuoteEditComponent } from './quote-edit.component';

describe('Quote Edit Component', () => {
  let fixture: ComponentFixture<QuoteEditComponent>;
  let component: QuoteEditComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    const context = mock(QuoteContextFacade);
    when(context.select('entityAsQuoteRequest')).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        DatePipe,
        MockComponent(InputComponent),
        MockComponent(LineItemListComponent),
        MockComponent(QuoteStateComponent),
        QuoteEditComponent,
      ],
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
