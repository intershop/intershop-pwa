import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { ContentPageletComponent } from 'ish-shared/cms/components/content-pagelet/content-pagelet.component';

import { ContentViewcontextComponent } from './content-viewcontext.component';

describe('Content Viewcontext Component', () => {
  let component: ContentViewcontextComponent;
  let fixture: ComponentFixture<ContentViewcontextComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ContentViewcontextComponent, MockComponent(ContentPageletComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentViewcontextComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
