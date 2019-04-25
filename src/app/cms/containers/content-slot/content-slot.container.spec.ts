import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { createSimplePageletView } from 'ish-core/utils/dev/test-data-utils';
import { SfeAdapterService } from '../../sfe-adapter/sfe-adapter.service';
import { ContentPageletContainerComponent } from '../content-pagelet/content-pagelet.container';

import { ContentSlotContainerComponent } from './content-slot.container';

describe('Content Slot Container', () => {
  let component: ContentSlotContainerComponent;
  let fixture: ComponentFixture<ContentSlotContainerComponent>;
  let element: HTMLElement;
  let sfeAdapterMock: SfeAdapterService;

  beforeEach(async(() => {
    sfeAdapterMock = mock(SfeAdapterService);

    TestBed.configureTestingModule({
      declarations: [ContentSlotContainerComponent, MockComponent(ContentPageletContainerComponent)],
      providers: [{ provide: SfeAdapterService, useValue: instance(sfeAdapterMock) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSlotContainerComponent);
    component = fixture.componentInstance;
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'pagelet',
      domain: 'domain',
      configurationParameters: {
        HTMLText: 'foo',
      },
      slots: [
        {
          definitionQualifiedName: 'slot123',
          displayName: 'slot',
          pageletIDs: [],
        },
      ],
    } as ContentPagelet;
    component.pagelet = createSimplePageletView(pagelet);
    component.slot = 'slot123';
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
