import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressUsComponent } from './address-us.component';

describe('AddressUsComponent', () => {
  let component: AddressUsComponent;
  let fixture: ComponentFixture<AddressUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressUsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
