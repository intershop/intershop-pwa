import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldTooltipComponent } from './field-tooltip.component';

describe('Field Tooltip Component', () => {
  let component: FieldTooltipComponent;
  let fixture: ComponentFixture<FieldTooltipComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FieldTooltipComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldTooltipComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
