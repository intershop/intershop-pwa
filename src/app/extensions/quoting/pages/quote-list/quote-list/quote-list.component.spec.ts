import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { anything, capture, spy, verify } from 'ts-mockito';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { Quote } from '../../../models/quoting/quoting.model';
import { QuoteExpirationDateComponent } from '../../../shared/quote-expiration-date/quote-expiration-date.component';
import { QuoteStateComponent } from '../../../shared/quote-state/quote-state.component';

import { QuoteListComponent } from './quote-list.component';

describe('Quote List Component', () => {
  let fixture: ComponentFixture<QuoteListComponent>;
  let component: QuoteListComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(QuoteExpirationDateComponent),
        MockComponent(QuoteStateComponent),
        MockPipe(DatePipe),
        QuoteListComponent,
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
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

  it('should throw deleteItem event when delete item is tapped', () => {
    const emitter = spy(component.deleteItem);

    component.onDeleteItem({ id: 'test', type: 'Quote' } as Quote);

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
      Object {
        "id": "test",
        "type": "Quote",
      }
    `);
  });
});
