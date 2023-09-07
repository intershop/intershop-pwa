import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemExtendedContentDisplayComponent } from './line-item-extended-content-display.component';

describe('Line Item Extended Content Display Component', () => {
  let component: LineItemExtendedContentDisplayComponent;
  let fixture: ComponentFixture<LineItemExtendedContentDisplayComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineItemExtendedContentDisplayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemExtendedContentDisplayComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
