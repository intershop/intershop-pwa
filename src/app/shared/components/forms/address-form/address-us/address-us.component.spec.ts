import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { AddressUsComponent } from './address-us.component';

describe('American Address Component', () => {
  let component: AddressUsComponent;
  let fixture: ComponentFixture<AddressUsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressUsComponent],
      providers: [
        { provide: TranslateService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(AddressUsComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });
});
