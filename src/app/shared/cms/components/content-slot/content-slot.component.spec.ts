import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ContentPageletComponent } from 'ish-shared/cms/components/content-pagelet/content-pagelet.component';
import { SfeAdapterService } from 'ish-shared/cms/sfe-adapter/sfe-adapter.service';

import { ContentSlotComponent } from './content-slot.component';

describe('Content Slot Component', () => {
  let component: ContentSlotComponent;
  let fixture: ComponentFixture<ContentSlotComponent>;
  let element: HTMLElement;
  let sfeAdapterMock: SfeAdapterService;

  beforeEach(async () => {
    sfeAdapterMock = mock(SfeAdapterService);

    await TestBed.configureTestingModule({
      declarations: [ContentSlotComponent, MockComponent(ContentPageletComponent)],
      providers: [{ provide: SfeAdapterService, useValue: instance(sfeAdapterMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSlotComponent);
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
    component.pagelet = createContentPageletView(pagelet);
    component.slot = 'slot123';
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
