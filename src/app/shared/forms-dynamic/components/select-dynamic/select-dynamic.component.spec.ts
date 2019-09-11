import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { SelectComponent } from 'ish-shared/forms/components/select/select.component';

import { SelectDynamicComponent } from './select-dynamic.component';

describe('Select Dynamic Component', () => {
  let component: SelectDynamicComponent;
  let fixture: ComponentFixture<SelectDynamicComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(SelectComponent), SelectDynamicComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SelectDynamicComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a select form component if field is provided', () => {
    component.field = {
      key: 'test',
      templateOptions: {},
    };

    fixture.detectChanges();
    expect(element.querySelector('ish-select')).toBeTruthy();
  });

  it('should not render an select form component if field is missing', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-select')).toBeFalsy();
  });
});
