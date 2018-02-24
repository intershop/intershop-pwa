// the NO_ERRORS_SCHEMA import and configuration is needed for the Karma tests to run with <carousel> and <slide> tags
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HomePageContainerComponent } from './home-page.container';

describe('Home Page Container', () => {
  let component: HomePageContainerComponent;
  let fixture: ComponentFixture<HomePageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CarouselModule.forRoot()],
      declarations: [HomePageContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
