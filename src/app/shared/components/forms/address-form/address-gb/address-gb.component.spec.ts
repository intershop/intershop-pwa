import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressGbComponent } from './address-gb.component';

describe('AddressGbComponent', () => {
  let component: AddressGbComponent;
  let fixture: ComponentFixture<AddressGbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressGbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressGbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
