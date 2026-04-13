import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderSimpleComponent } from './header-simple.component';

describe('Header Simple Component', () => {
  let fixture: ComponentFixture<HeaderSimpleComponent>;
  let element: HTMLElement;
  let component: HeaderSimpleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSimpleComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSimpleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
