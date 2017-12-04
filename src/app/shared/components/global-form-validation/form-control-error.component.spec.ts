import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormControlErrorComponent } from './form-control-error.component';

describe('Form control error component', () => {
  let fixture: ComponentFixture<FormControlErrorComponent>;
  let component: FormControlErrorComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
      ],
      declarations: [
        FormControlErrorComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormControlErrorComponent);
    component = fixture.componentInstance;
  });

  function searchErrorDisplay() {
    fixture.detectChanges();
    return fixture.debugElement.query(By.css('small'));
  }

  it('should not create form control error when initialized', () => {
    expect(component.messagesList).toBeFalsy();
    expect(searchErrorDisplay()).toBeFalsy();
  });

  it('should create form control error when error is set', () => {
    component.messagesList = ['error1'];
    expect(searchErrorDisplay()).toBeTruthy();
  });
});
