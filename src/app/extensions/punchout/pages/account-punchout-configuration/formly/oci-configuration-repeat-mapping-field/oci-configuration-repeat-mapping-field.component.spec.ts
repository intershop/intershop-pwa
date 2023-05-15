import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OciConfigurationRepeatMappingFieldComponent } from './oci-configuration-repeat-mapping-field.component';

describe('Oci Configuration Repeat Mapping Field Component', () => {
  let component: OciConfigurationRepeatMappingFieldComponent;
  let fixture: ComponentFixture<OciConfigurationRepeatMappingFieldComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OciConfigurationRepeatMappingFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OciConfigurationRepeatMappingFieldComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
