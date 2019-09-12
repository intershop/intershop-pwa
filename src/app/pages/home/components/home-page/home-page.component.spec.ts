import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MockComponent } from 'ng-mocks';

import { ContentIncludeContainerComponent } from 'ish-shared/cms/containers/content-include/content-include.container';

import { HomePageComponent } from './home-page.component';

describe('Home Page Component', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbCarouselModule],
      declarations: [HomePageComponent, MockComponent(ContentIncludeContainerComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
