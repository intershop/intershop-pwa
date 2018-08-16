import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { spy, verify } from 'ts-mockito';

import { BasketAddToQuoteComponent } from './basket-add-to-quote.component';

describe('Basket Add To Quote Component', () => {
  let component: BasketAddToQuoteComponent;
  let fixture: ComponentFixture<BasketAddToQuoteComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [BasketAddToQuoteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketAddToQuoteComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw basketToQuote event when addToQuote is triggered.', () => {
    const emitter = spy(component.basketToQuote);

    component.addToQuote();

    verify(emitter.emit()).once();
  });
});
