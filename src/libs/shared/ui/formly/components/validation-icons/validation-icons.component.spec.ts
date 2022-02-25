import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';

import { ValidationIconsComponent } from './validation-icons.component';

describe('Validation Icons Component', () => {
  let component: ValidationIconsComponent;
  let fixture: ComponentFixture<ValidationIconsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(FaIconComponent), ValidationIconsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationIconsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.field = {};
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
