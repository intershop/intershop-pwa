import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-views';
import { ContentSlotContainerComponent } from '../../../cms/containers/content-slot/content-slot.container';

import { CMSDialogComponent } from './cms-dialog.component';

describe('Cms Dialog Component', () => {
  let component: CMSDialogComponent;
  let fixture: ComponentFixture<CMSDialogComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CMSDialogComponent, MockComponent(ContentSlotContainerComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be display pagelet content if content variable is not empty', () => {
    const pagelet = {
      domain: 'domain',
      displayName: 'pagelet1',
      definitionQualifiedName: 'fq',
      id: 'id',
      configurationParameters: { Content: 'testContent' },
    } as ContentPagelet;
    const pageletView = createContentPageletView(pagelet.id, { [pagelet.id]: pagelet }) as ContentPageletView;
    component.pagelet = pageletView;
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('[data-testing-id="dialog-content"]').innerHTML).toBe('testContent');
  });

  it('should be display slot content if slot is not empty', () => {
    const dialog = {
      id: 'dialogId',
      domain: 'domain',
      displayName: 'dialog displayName',
      definitionQualifiedName: 'fq',
    };
    const pagelet2 = {
      domain: 'domain',
      displayName: 'pagelet1',
      definitionQualifiedName: 'fq',
      id: 'id',
      configurationParameters: {},
      slots: [
        {
          definitionQualifiedName: 'app_sf_responsive_cm:slot.dialog.content.pagelet2-Slot',
          pageletIDs: dialog.id,
        },
      ],
    };

    component.pagelet = createContentPageletView(pagelet2.id, {
      [pagelet2.id]: pagelet2,
      [dialog.id]: dialog,
    });

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
