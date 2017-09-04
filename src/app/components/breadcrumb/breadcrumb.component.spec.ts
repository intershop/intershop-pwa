import { ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from './breadcrumb.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('BreadCrumb Component', () => {
    let fixture: ComponentFixture<BreadcrumbComponent>;
    let component: BreadcrumbComponent;
    let element: HTMLElement;
    const mockActivatedRoute: ActivatedRoute = null;

    class RouterStub {
        public navigate = jasmine.createSpy('navigate');
        public ne = new NavigationEnd(1, '', '');
        // id: number,
        // /** @docsNotRequired */
        // url: string,
        // /** @docsNotRequired */
        // urlAfterRedirects: string
        public events = new Observable((observer) => {
            observer.next(this.ne);
            observer.complete();
        });
        public navigateByUrl(url: string) { location.hash = url; }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BreadcrumbComponent],
            providers: [
                { provide: Router, useClass: RouterStub },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ],
            imports: [RouterTestingModule]
        });
        fixture = TestBed.createComponent(BreadcrumbComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('should call ngOnInit', () => {
        fixture.detectChanges();
    });
});
