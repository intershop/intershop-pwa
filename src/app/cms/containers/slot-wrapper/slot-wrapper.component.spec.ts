import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { SfeAdapterService } from '../../../cms/sfe-adapter/sfe-adapter.service';

import { SlotWrapperComponent } from './slot-wrapper.component';

describe('Slot Wrapper Component', () => {
  let component: SlotWrapperComponent;
  let fixture: ComponentFixture<SlotWrapperComponent>;
  let element: HTMLElement;
  let sfeAdapterMock: SfeAdapterService;

  beforeEach(async(() => {
    sfeAdapterMock = mock(SfeAdapterService);

    TestBed.configureTestingModule({
      declarations: [SlotWrapperComponent],
      providers: [{ provide: SfeAdapterService, useValue: instance(sfeAdapterMock) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotWrapperComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
