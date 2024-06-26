import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ReturnRequestFacade } from '../../facades/return-request.facade';

import { ReturnRequestReturnButtonComponent } from './return-request-return-button.component';

describe('Return Request Return Button Component', () => {
  let component: ReturnRequestReturnButtonComponent;
  let fixture: ComponentFixture<ReturnRequestReturnButtonComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnRequestReturnButtonComponent],
      providers: [{ provide: ReturnRequestFacade, useFactory: () => instance(mock(ReturnRequestFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRequestReturnButtonComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
