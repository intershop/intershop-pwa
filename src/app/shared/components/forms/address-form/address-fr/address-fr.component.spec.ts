import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFrComponent } from './address-fr.component';

describe('AddressFrComponent', () => {
  let component: AddressFrComponent;
  let fixture: ComponentFixture<AddressFrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressFrComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
