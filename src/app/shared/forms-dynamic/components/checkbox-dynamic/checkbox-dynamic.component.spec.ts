import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';

import { CheckboxDynamicComponent } from './checkbox-dynamic.component';

describe('Checkbox Dynamic Component', () => {
  let component: CheckboxDynamicComponent;
  let fixture: ComponentFixture<CheckboxDynamicComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxDynamicComponent, MockComponent(CheckboxComponent)],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CheckboxDynamicComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        component.field = {
          key: 'test',
          templateOptions: {},
          fieldGroupClassName: 'offset',
        };
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a checkbox form component if field is provided', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-checkbox')).toBeTruthy();
  });

  it('should not render an checkbox form component if field is missing', () => {
    component.field = {
      key: 'test',
      templateOptions: {},
      fieldGroupClassName: undefined,
    };
    fixture.detectChanges();
    expect(element.querySelector('ish-checkbox')).toBeFalsy();
  });
});
