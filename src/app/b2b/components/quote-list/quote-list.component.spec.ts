import { DatePipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Quote } from '../../../models/quote/quote.model';
import { MockComponent } from '../../../utils/dev/mock.component';
import { QuoteListComponent } from './quote-list.component';

describe('Quote List Component', () => {
  let fixture: ComponentFixture<QuoteListComponent>;
  let component: QuoteListComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuoteListComponent,
        MockComponent({
          selector: 'ish-quote-state',
          template: 'Quote State Component',
          inputs: ['quote'],
        }),
        MockComponent({
          selector: 'ish-modal-dialog',
          template: 'Modal Dialog Component',
          inputs: ['options', 'confirmed'],
        }),
      ],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      providers: [DatePipe],
    }).compileComponents();
  }));

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

  describe('get valid to date', () => {
    it("should return '-' as SafeHtml if no timestamp is set ", () => {
      expect(component.getValidToDate()).toEqual({ changingThisBreaksApplicationSecurity: '-' });
    });

    it('should return propper date string as SafeHtml if timestamp is set', () => {
      const dateTime = new Date().getTime() + 1000;

      expect(component.getValidToDate(dateTime)).toEqual({
        changingThisBreaksApplicationSecurity: new DatePipe('en-US').transform(dateTime, 'shortDate'),
      });
    });

    it('should return propper, danger themed date string as SafeHtml if timestamp is set and smaller current date', () => {
      const dateTime = new Date().getTime() - 1000;

      expect(component.getValidToDate(dateTime)).toEqual({
        changingThisBreaksApplicationSecurity: `<span class="text-danger">${new DatePipe('en-US').transform(
          dateTime,
          'shortDate'
        )}</span>`,
      });
    });
  });

  it('should throw deleteItem event when delete item is tapped', done => {
    component.deleteItem.subscribe(item => {
      expect(item.type).toBe('Quote');
      done();
    });

    component.onDeleteItem({ id: 'test', type: 'Quote' } as Quote);
  });
});
