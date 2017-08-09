// import { ComponentFixture } from '@angular/core/testing';
// import { DebugElement, Injector, ReflectiveInjector, NO_ERRORS_SCHEMA } from '@angular/core';
// import { Observable } from 'rxjs/Rx';
// import { TestBed } from '@angular/core/testing';
// import { BreadcrumbComponent } from './breadCrumb.component';
// import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing'

// describe('BreadCrumb Component', () => {
//     let fixture: ComponentFixture<BreadcrumbComponent>,
//         component: BreadcrumbComponent,
//         element: HTMLElement,
//         debugEl: DebugElement;
//         const mockActivatedRoute: ActivatedRoute = null

//     class RouterStub {
//         public navigate = jasmine.createSpy('navigate');
//         public ne = new NavigationEnd(1, '', '');
//         // id: number,
//         // /** @docsNotRequired */
//         // url: string,
//         // /** @docsNotRequired */
//         // urlAfterRedirects: string
//         public events = new Observable((observer) => {
//             observer.next(this.ne);
//             observer.complete();
//         });
//         public navigateByUrl(url: string) { location.hash = url; }
//     }

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             declarations: [BreadcrumbComponent],
//             providers: [
//                 { provide: Router, useClass: RouterStub },
//                 { provide: ActivatedRoute, useValue: mockActivatedRoute }
//             ],
//             imports: [RouterTestingModule]
//         });
//         fixture = TestBed.createComponent(BreadcrumbComponent);
//         component = fixture.componentInstance;
//         debugEl = fixture.debugElement;
//         element = fixture.nativeElement;
//     })

//     it('should call ngOnInit', () => {
//         component.ngOnInit();
//     })

// });
