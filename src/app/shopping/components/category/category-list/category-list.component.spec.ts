import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { Category } from '../../../../models/category/category.model';
import { CategoryListComponent } from './category-list.component';

describe('Category List Component', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [CategoryListComponent],
        providers: [{ provide: ICM_BASE_URL, useValue: 'http://www.example.org' }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.categories = [
      { id: 'id1', uniqueId: 'uid1', name: 'name1', images: [{ effectiveUrl: '/url1.png' }] },
      { id: 'id2', uniqueId: 'uid2', name: 'name2', images: [{ effectiveUrl: '/url2.png' }] },
    ] as Category[];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
