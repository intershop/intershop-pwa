import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { SfeAdapterService } from '../../sfe-adapter/sfe-adapter.service';

import { ContentSlotWrapperContainerComponent } from './content-slot-wrapper.container';

describe('Content Slot Wrapper Container', () => {
  let component: ContentSlotWrapperContainerComponent;
  let fixture: ComponentFixture<ContentSlotWrapperContainerComponent>;
  let element: HTMLElement;
  let sfeAdapterMock: SfeAdapterService;

  beforeEach(async(() => {
    sfeAdapterMock = mock(SfeAdapterService);

    TestBed.configureTestingModule({
      declarations: [ContentSlotWrapperContainerComponent],
      providers: [{ provide: SfeAdapterService, useValue: instance(sfeAdapterMock) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSlotWrapperContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
