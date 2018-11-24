import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SelectRegionComponent } from './select-region.component';

describe('Select Region Component', () => {
  let component: SelectRegionComponent;
  let fixture: ComponentFixture<SelectRegionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectRegionComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SelectRegionComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          countryCode: new FormControl('BG'),
          state: new FormControl('Region1', [Validators.required]),
        });
        component.form = form;
        component.regions = [
          { countryCode: 'BG', regionCode: '02', name: 'Burgas' },
          { countryCode: 'BG', regionCode: '23', name: 'Sofia' },
        ];
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('state');
    expect(component.label).toEqual('State/Province');
  });

  it('should get and display regions for a certain country', () => {
    const changes: SimpleChanges = {
      regions: new SimpleChange(undefined, component.regions, false),
    };
    component.ngOnChanges(changes);

    fixture.detectChanges();
    expect(component.options).toHaveLength(2);
    expect(element.querySelector('select[data-testing-id=state]')).toBeTruthy();
  });
});
