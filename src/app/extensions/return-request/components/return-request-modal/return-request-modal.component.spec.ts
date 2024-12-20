import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ReturnRequestFacade } from '../../facades/return-request.facade';

import { ReturnRequestModalComponent } from './return-request-modal.component';

describe('Return Request Modal Component', () => {
  let component: ReturnRequestModalComponent;
  let fixture: ComponentFixture<ReturnRequestModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnRequestModalComponent],
      providers: [{ provide: ReturnRequestFacade, useFactory: () => instance(mock(ReturnRequestFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRequestModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
