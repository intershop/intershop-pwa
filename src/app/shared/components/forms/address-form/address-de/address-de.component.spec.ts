import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { AddressDeComponent } from './address-de.component';

describe('German Address Component', () => {
  let component: AddressDeComponent;
  let fixture: ComponentFixture<AddressDeComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressDeComponent],
      providers: [
        { provide: TranslateService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(AddressDeComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });
});
