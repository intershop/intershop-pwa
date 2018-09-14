import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ContentSlotView, createSlotView } from '../../../models/content-view/content-views';
import { MockComponent } from '../../../utils/dev/mock.component';

import { ContentSlotContainerComponent } from './content-slot.container';

describe('Content Slot Container', () => {
  let component: ContentSlotContainerComponent;
  let fixture: ComponentFixture<ContentSlotContainerComponent>;
  let element: HTMLElement;
  let slot: ContentSlotView;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContentSlotContainerComponent,
        MockComponent({ selector: 'ish-content-pagelet', template: 'Content Pagelet', inputs: ['pagelet'] }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSlotContainerComponent);
    component = fixture.componentInstance;
    slot = createSlotView(
      {
        definitionQualifiedName: 'test.slot',
        pageletIDs: [],
        configurationParameters: {},
      },
      {}
    );
    component.slot = slot;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
