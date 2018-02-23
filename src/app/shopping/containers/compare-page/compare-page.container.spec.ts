import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparePageContainerComponent } from './compare-page.container';

describe('Compare Page Container', () => {
  let fixture: ComponentFixture<ComparePageContainerComponent>;
  let component: ComparePageContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComparePageContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
