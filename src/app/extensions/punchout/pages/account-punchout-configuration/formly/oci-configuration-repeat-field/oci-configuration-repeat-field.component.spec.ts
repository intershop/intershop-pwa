import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OciConfigurationRepeatFieldComponent } from './oci-configuration-repeat-field.component';

describe('Oci Configuration Repeat Field Component', () => {
  let component: OciConfigurationRepeatFieldComponent;
  let fixture: ComponentFixture<OciConfigurationRepeatFieldComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OciConfigurationRepeatFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OciConfigurationRepeatFieldComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
