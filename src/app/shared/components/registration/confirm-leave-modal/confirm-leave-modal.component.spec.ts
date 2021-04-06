import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ConfirmLeaveModalComponent } from './confirm-leave-modal.component';

describe('Confirm Leave Modal Component', () => {
  let component: ConfirmLeaveModalComponent;
  let fixture: ComponentFixture<ConfirmLeaveModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmLeaveModalComponent, MockPipe(TranslatePipe)],
      providers: [{ provide: NgbActiveModal, useFactory: () => instance(mock(NgbActiveModal)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmLeaveModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
