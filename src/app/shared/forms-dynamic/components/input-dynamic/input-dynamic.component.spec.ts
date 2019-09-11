import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { InputDynamicComponent } from './input-dynamic.component';

describe('Input Dynamic Component', () => {
  let component: InputDynamicComponent;
  let fixture: ComponentFixture<InputDynamicComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputDynamicComponent, MockComponent(InputComponent)],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InputDynamicComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render an input form component if field is provided', () => {
    component.field = {
      key: 'test',
      templateOptions: {},
    };

    fixture.detectChanges();
    expect(element.querySelector('ish-input')).toBeTruthy();
  });

  it('should not render an input form component if field is missing', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-input')).toBeFalsy();
  });
});
