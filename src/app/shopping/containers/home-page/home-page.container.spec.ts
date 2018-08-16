import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MockComponent } from '../../../utils/dev/mock.component';

import { HomePageContainerComponent } from './home-page.container';

describe('Home Page Container', () => {
  let component: HomePageContainerComponent;
  let fixture: ComponentFixture<HomePageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({ selector: 'ish-home-page', template: 'Home Page Component' }),
        HomePageContainerComponent,
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
