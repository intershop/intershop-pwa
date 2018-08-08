import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxComponent } from './checkbox.component';

describe('Checkbox Component', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const form = new FormGroup({
      requiredField: new FormControl('', [Validators.required]),
      simpleField: new FormControl(),
    });
    component.label = 'label';
    component.form = form;
    component.controlName = 'requiredField';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[data-testing-id=requiredField]')).toBeTruthy();
  });

  it('should set input type properly on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[type=checkbox]')).toBeTruthy();
  });
});
