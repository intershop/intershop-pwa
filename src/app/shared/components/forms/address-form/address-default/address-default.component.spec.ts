import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { AddressDefaultComponent } from './address-default.component';

describe('Default Address Component', () => {
  let component: AddressDefaultComponent;
  let fixture: ComponentFixture<AddressDefaultComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressDefaultComponent],
      providers: [
        { provide: TranslateService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(AddressDefaultComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });
});
