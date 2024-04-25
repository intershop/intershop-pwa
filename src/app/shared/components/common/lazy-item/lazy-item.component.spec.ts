import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyItemComponent } from './lazy-item.component';

describe('Lazy Item Component', () => {
  let component: LazyItemComponent;
  let fixture: ComponentFixture<LazyItemComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LazyItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
