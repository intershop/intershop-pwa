import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { QuotingFacade } from '../../../facades/quoting.facade';
import { Quote } from '../../../models/quoting/quoting.model';

import { QuoteListComponent } from './quote-list.component';

describe('Quote List Component', () => {
  let fixture: ComponentFixture<QuoteListComponent>;
  let component: QuoteListComponent;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async () => {
    quotingFacade = mock(QuotingFacade);
    await TestBed.configureTestingModule({
      declarations: [QuoteListComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: QuotingFacade, useFactory: () => instance(quotingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list text if there are no quotes', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyList]')).toBeTruthy();
  });

  it('should throw deleteItem event when delete item is tapped', () => {
    when(quotingFacade.delete(anything())).thenReturn();

    component.onDeleteItem({ id: 'test', type: 'Quote' } as Quote);

    verify(quotingFacade.delete(anything())).once();
  });
});
