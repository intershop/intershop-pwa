import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCountryComponent } from './select-country.component';

describe('SelectCountryComponent', () => {
  let component: SelectCountryComponent;
  let fixture: ComponentFixture<SelectCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
