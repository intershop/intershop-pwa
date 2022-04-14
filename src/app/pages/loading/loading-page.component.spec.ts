import { ComponentFixture, TestBed } from '@angular/core/testing';

import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';

import { LoadingPageComponent } from './loading-page.component';

describe('Loading Page Component', () => {
  let component: LoadingPageComponent;
  let fixture: ComponentFixture<LoadingPageComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component', () => {
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-loading",
      ]
    `);
  });
});
