import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { contentReducers } from 'ish-core/store/content/content-store.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ContentPageContainerComponent } from './content-page.container';

describe('Content Page Container', () => {
  let fixture: ComponentFixture<ContentPageContainerComponent>;
  let component: ContentPageContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContentPageContainerComponent,
        MockComponent({ selector: 'ish-breadcrumb', template: 'Breadcrumb Component', inputs: ['trail'] }),
        MockComponent({ selector: 'ish-content-page', template: 'Content Page Component', inputs: ['contentPage'] }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
      ],
      imports: [
        RouterTestingModule,
        ngrxTesting({
          content: contentReducers,
        }),
      ],
      providers: [ContentPageContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
