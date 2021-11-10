import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { QuotingFacade } from '../../../facades/quoting.facade';
import { Quote } from '../../../models/quoting/quoting.model';
import { QuoteExpirationDateComponent } from '../../../shared/quote-expiration-date/quote-expiration-date.component';
import { QuoteStateComponent } from '../../../shared/quote-state/quote-state.component';

import { QuoteListComponent } from './quote-list.component';

describe('Quote List Component', () => {
  let fixture: ComponentFixture<QuoteListComponent>;
  let component: QuoteListComponent;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async () => {
    quotingFacade = mock(QuotingFacade);
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(QuoteExpirationDateComponent),
        MockComponent(QuoteStateComponent),
        MockPipe(DatePipe),
        QuoteListComponent,
      ],
      imports: [CdkTableModule, RouterTestingModule, TranslateModule.forRoot()],
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
