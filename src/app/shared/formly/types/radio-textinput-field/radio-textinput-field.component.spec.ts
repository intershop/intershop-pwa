import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioTextinputFieldComponent } from './radio-textinput-field.component';

describe('Radio Textinput Field Component', () => {
  let component: RadioTextinputFieldComponent;
  let fixture: ComponentFixture<RadioTextinputFieldComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioTextinputFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioTextinputFieldComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
