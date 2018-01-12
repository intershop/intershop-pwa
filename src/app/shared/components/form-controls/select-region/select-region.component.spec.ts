import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito';
import { RegionData } from '../../../../models/region/region.interface';
import { RegionService } from '../../../services/countries/region.service';
import { SelectRegionComponent } from './select-region.component';

describe('Select Region Component', () => {
  let component: SelectRegionComponent;
  let fixture: ComponentFixture<SelectRegionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const translateServiceMock = mock(TranslateService);
    when(translateServiceMock.get(anything())).thenCall((data) => {
      return Observable.of(data);
    });
    const regionServiceMock = mock(RegionService);
    when(regionServiceMock.getRegions('BG')).thenReturn(

      Observable.of({ countryCode: 'BG', regionCode: '02', name: 'Burgas' } as RegionData,
        { countryCode: 'BG', regionCode: '23', name: 'Sofia' } as RegionData)
    );
    when(regionServiceMock.getRegions('DE')).thenReturn(
      Observable.of()
    );

    TestBed.configureTestingModule({
      declarations: [SelectRegionComponent],
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
        { provide: RegionService, useFactory: () => instance(regionServiceMock) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(SelectRegionComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          countryCode: new FormControl('BG'),
          state: new FormControl('Region1', [Validators.required])
        });
        component.form = form;
        component.countryCode = 'BG';
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('state', 'control Name should be <state>');
    expect(component.label).toEqual('State/Province', 'label should be <State/Province>');
  });

  it('should throw an error if input parameter countryCode is not set', () => {
    component.countryCode = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should get and display regions for a certain country', () => {
    component.options = component.getStateOptions();

    fixture.detectChanges();
    expect(component.options.length).toEqual(2, '2 regions are in the options array');
    expect(element.querySelector('select[data-testing-id=state]')).toBeTruthy('state select is rendered');
  });

  it('should reset state validator and value if no regions are found', () => {
    component.countryCode = 'DE';
    component.options = component.getStateOptions();
    fixture.detectChanges();
    expect(component.options.length).toEqual(0, '0 regions are in the options array');
    expect(component.form.get('state').validator).toBeNull('state validator is empty');
    expect(component.form.get('state').value).toEqual('', 'state validator is empty');
    expect(element.querySelector('select[data-testing-id=state]')).toBeFalsy('state select is not rendered');
  });
});
