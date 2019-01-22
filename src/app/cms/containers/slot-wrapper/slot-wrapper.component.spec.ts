import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SlotWrapperComponent } from './slot-wrapper.component';

describe('Slot Wrapper Component', () => {
  let component: SlotWrapperComponent;
  let fixture: ComponentFixture<SlotWrapperComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlotWrapperComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotWrapperComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
