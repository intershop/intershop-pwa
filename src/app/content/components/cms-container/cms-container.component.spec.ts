import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';
import { PipesModule } from '../../../shared/pipes.module';
import { MockComponent } from '../../../utils/dev/mock.component';

import { CMSContainerComponent } from './cms-container.component';

describe('Cms Container Component', () => {
  let component: CMSContainerComponent;
  let fixture: ComponentFixture<CMSContainerComponent>;
  let element: HTMLElement;
  let pagelet: ContentPagelet;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CMSContainerComponent,
        MockComponent({ selector: 'ish-content-pagelet', template: 'Content Pagelet', inputs: ['pagelet'] }),
      ],
      imports: [PipesModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSContainerComponent);
    component = fixture.componentInstance;
    pagelet = {
      definitionQualifiedName: 'fq',
      displayName: 'name',
      id: 'id',
      configurationParameters: {
        CSSClass: 'foo-class',
        Grid: 'ExtraSmall:12,Small:6,Medium:4,Large:0',
      },
      slots: [
        {
          definitionQualifiedName: 'test.slot',
          pageletIDs: [],
        },
      ],
    };
    component.pagelet = pagelet;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
