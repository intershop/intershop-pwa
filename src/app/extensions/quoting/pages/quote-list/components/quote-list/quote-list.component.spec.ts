import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { MockComponent } from '../../../../../../utils/dev/mock.component';
import { Quote } from '../../../../models/quote/quote.model';

import { QuoteListComponent } from './quote-list.component';

describe('Quote List Component', () => {
  let fixture: ComponentFixture<QuoteListComponent>;
  let component: QuoteListComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-modal-dialog',
          template: 'Modal Dialog Component',
          inputs: ['options', 'confirmed'],
        }),
        MockComponent({
          selector: 'ish-quote-state',
          template: 'Quote State Component',
          inputs: ['quote'],
        }),
        QuoteListComponent,
      ],
      imports: [IconModule, RouterTestingModule, TranslateModule.forRoot()],
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

  it('should throw deleteItem event when delete item is tapped', done => {
    component.deleteItem.subscribe(item => {
      expect(item.type).toBe('Quote');
      done();
    });

    component.onDeleteItem({ id: 'test', type: 'Quote' } as Quote);
  });

  it('should sort quote items using there creation date if ngOnChanges triggered', () => {
    component.quotes = [
      { creationDate: 1, displayName: 'FIRST', items: [] } as Quote,
      { creationDate: 2, displayName: 'SECOND', items: [] } as Quote,
    ];

    component.ngOnChanges();
    expect(component.quotes[0].displayName).toBe('SECOND');
  });
});
