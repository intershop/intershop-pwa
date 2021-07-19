import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonFieldgroupWrapperComponent } from './radio-button-fieldgroup-wrapper.component';

describe('Radio Button Fieldgroup Wrapper Component', () => {
  let component: RadioButtonFieldgroupWrapperComponent;
  let fixture: ComponentFixture<RadioButtonFieldgroupWrapperComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioButtonFieldgroupWrapperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonFieldgroupWrapperComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
