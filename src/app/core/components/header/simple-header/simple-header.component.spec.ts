import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleHeaderComponent } from '../simple-header/simple-header.component';

describe('Simple Header Component', () => {
  let fixture: ComponentFixture<SimpleHeaderComponent>;
  let element: HTMLElement;
  let component: SimpleHeaderComponent;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SimpleHeaderComponent],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(SimpleHeaderComponent);
          component = fixture.componentInstance;
          element = fixture.nativeElement;
        });
    })
  );

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
