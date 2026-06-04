import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { ReturnRequestFacade } from '../../facades/return-request.facade';

import { ReturnRequestGuestPageComponent } from './return-request-guest-page.component';

describe('Return Request Guest Page Component', () => {
  let component: ReturnRequestGuestPageComponent;
  let fixture: ComponentFixture<ReturnRequestGuestPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ReturnRequestGuestPageComponent],
      providers: [
        { provide: ReturnRequestFacade, useFactory: () => instance(mock(ReturnRequestFacade)) },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRequestGuestPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
