import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotCmsImageComponent } from './dot-cms-image.component';

describe('DotCmsImageComponent', () => {
  let component: DotCmsImageComponent;
  let fixture: ComponentFixture<DotCmsImageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DotCmsImageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotCmsImageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
