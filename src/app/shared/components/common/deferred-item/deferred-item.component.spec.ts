import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockDirective } from 'ng-mocks';

import { IntersectionObserverDirective } from 'ish-core/directives/intersection-observer.directive';
import { LazyLoadingContentDirective } from 'ish-core/directives/lazy-loading-content.directive';

import { DeferredItemComponent } from './deferred-item.component';

@Component({
  standalone: false,
  template: `
    <ish-deferred-item [cssClass]="cssClass">
      <ng-template ishLazyLoadingContent>
        <span class="lazy-content">content</span>
      </ng-template>
    </ish-deferred-item>
  `,
})
class TestHostComponent {
  cssClass: string | undefined;
}

describe('Deferred Item Component', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DeferredItemComponent,
        LazyLoadingContentDirective,
        MockDirective(IntersectionObserverDirective),
        TestHostComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render lazy content before becoming visible', () => {
    expect(element.querySelector('.lazy-content')).toBeFalsy();
  });

  it('should render lazy content after becoming visible', () => {
    const deferredItem = fixture.debugElement.children[0].componentInstance as DeferredItemComponent;
    deferredItem.onVisibilityChange('Visible');
    fixture.detectChanges();

    expect(element.querySelector('.lazy-content')).toBeTruthy();
  });

  it('should keep content rendered once visible even when scrolled out of viewport', () => {
    const deferredItem = fixture.debugElement.children[0].componentInstance as DeferredItemComponent;
    deferredItem.onVisibilityChange('Visible');
    fixture.detectChanges();
    deferredItem.onVisibilityChange('NotVisible');
    fixture.detectChanges();

    expect(element.querySelector('.lazy-content')).toBeTruthy();
  });

  it('should apply cssClass to the wrapper element', () => {
    component.cssClass = 'col-6';
    fixture.detectChanges();

    expect(element.querySelector('.col-6')).toBeTruthy();
  });
});
