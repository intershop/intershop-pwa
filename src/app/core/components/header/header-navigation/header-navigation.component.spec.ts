import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderNavigationComponent } from './header-navigation.component';

describe('Header Navigation Component', () => {
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let component: HeaderNavigationComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderNavigationComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
