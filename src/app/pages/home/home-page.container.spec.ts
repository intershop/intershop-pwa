import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { HomePageContainerComponent } from './home-page.container';

describe('Home Page Container', () => {
  let component: HomePageContainerComponent;
  let fixture: ComponentFixture<HomePageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePageContainerComponent,
        MockComponent({ selector: 'ish-home-page', template: 'Home Page Component' }),
      ],
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
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
