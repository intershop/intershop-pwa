import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { TactonFacade } from '../../../facades/tacton.facade';

import { TactonStepButtonsComponent } from './tacton-step-buttons.component';

describe('Tacton Step Buttons Component', () => {
  let component: TactonStepButtonsComponent;
  let fixture: ComponentFixture<TactonStepButtonsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TactonStepButtonsComponent],
      providers: [{ provide: TactonFacade, useFactory: () => instance(mock(TactonFacade)) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonStepButtonsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
