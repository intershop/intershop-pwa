import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPageDirective } from './print-page.directive';

describe('Print Page Directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let print: jest.SpyInstance;

  @Component({
    standalone: false,
    template: ` <a href="#" ishPrintPage role="button">Print</a> `,
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

  it('should open the print dialog without navigating when clicked', () => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    (fixture.nativeElement as HTMLElement).querySelector('a').dispatchEvent(event);

    expect(print).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBeTrue();
  });
});
