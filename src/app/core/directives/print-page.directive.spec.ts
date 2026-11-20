import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPageDirective } from './print-page.directive';

describe('Print Page Directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let print: jest.SpyInstance;

  @Component({
    standalone: false,
    template: ` <a ishPrintPage role="button" tabindex="0">Print</a> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintPageDirective, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    print = jest.spyOn(window, 'print').mockImplementation(() => undefined);
  });

  afterEach(() => {
    print.mockRestore();
  });

  it('should open the print dialog when clicked', () => {
    (fixture.nativeElement as HTMLElement).querySelector('a').click();

    expect(print).toHaveBeenCalledTimes(1);
  });

  it('should open the print dialog when Enter is pressed', () => {
    (fixture.nativeElement as HTMLElement)
      .querySelector('a')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(print).toHaveBeenCalledTimes(1);
  });

  it('should open the print dialog without scrolling when Space is pressed', () => {
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });

    (fixture.nativeElement as HTMLElement).querySelector('a').dispatchEvent(event);

    expect(print).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBeTrue();
  });
});
