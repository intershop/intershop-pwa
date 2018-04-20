import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { ContentInclude } from '../../../models/content-include/content-include.model';
import { MockComponent } from '../../../utils/dev/mock.component';
import { ContentIncludesService } from '../../services/content-includes/content-includes.service';

import { ContentIncludeContainerComponent } from './content-include.container';

describe('Content Include Container', () => {
  let component: ContentIncludeContainerComponent;
  let fixture: ComponentFixture<ContentIncludeContainerComponent>;
  let element: HTMLElement;
  let includeId: string;
  let contentIncludesServiceMock: ContentIncludesService;

  beforeEach(async(() => {
    contentIncludesServiceMock = mock(ContentIncludesService);
    when(contentIncludesServiceMock.getContentInclude(anyString())).thenReturn(
      of({
        displayName: 'test.include',
        definitionQualifiedName: 'test.include-Include',
        pagelets: [],
      } as ContentInclude)
    );

    TestBed.configureTestingModule({
      declarations: [
        ContentIncludeContainerComponent,
        MockComponent({ selector: 'ish-content-pagelet', template: 'Content Pagelet', inputs: ['pagelet'] }),
      ],
      imports: [],
      providers: [{ provide: ContentIncludesService, useFactory: () => instance(contentIncludesServiceMock) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentIncludeContainerComponent);
    component = fixture.componentInstance;
    includeId = 'test.include';
    component.includeId = includeId;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
