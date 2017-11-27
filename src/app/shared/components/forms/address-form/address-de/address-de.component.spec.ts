import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDeComponent } from './address-de.component';

describe('AddressDeComponent', () => {
  let component: AddressDeComponent;
  let fixture: ComponentFixture<AddressDeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressDeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
