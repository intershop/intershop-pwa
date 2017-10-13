import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbService } from './breadcrumb.service';

describe('BreadCrumb Component', () => {
    let fixture: ComponentFixture<BreadcrumbComponent>;
    let component: BreadcrumbComponent;
    let element: HTMLElement;
    let routerMock: Router;
    let breadcrumbServiceMock: BreadcrumbService;
    beforeEach(() => {
        routerMock = mock(Router);
        breadcrumbServiceMock = mock(BreadcrumbService);

        TestBed.configureTestingModule({
            declarations: [BreadcrumbComponent],
            providers: [
                { provide: Router, useFactory: () => instance(routerMock) },
                { provide: BreadcrumbService, useFactory: () => instance(breadcrumbServiceMock) }
            ]
        });
        fixture = TestBed.createComponent(BreadcrumbComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
        expect(element).toBeTruthy();
    });

    it('should call the generateBreadcrumbTrail method of component from ngOnInit and confirm that the length of _urls is 2', () => {
        when(routerMock.events).thenReturn(Observable.of(new NavigationEnd(2, '/category/Computers', '/category/Computers')));
        fixture.detectChanges();
        expect(component._urls.length).toBe(2);
    });

    it('should confirm the length of the _urls to be 4', () => {
        expect(component._urls.length).toBe(0);
        component.generateBreadcrumbTrail('category/Home-Entertainment/220/1584');
        expect(component._urls.length).toBe(4);
    });

    it('should confirm that navigateByUrl method is called with provided arguments when navigateTo method is called', () => {
        component.navigateTo('category/Home%20Entertainment');

        verify(routerMock.navigateByUrl(anything())).once();

        const [navigateToArgument] = capture(routerMock.navigateByUrl).last();
        expect(navigateToArgument).toEqual('category/Home%20Entertainment');
    });

    it('should call the getFriendlyNameForRoute of breadcrumbServiceMock and should return "Welcome!"', () => {
        when(breadcrumbServiceMock.getFriendlyNameForRoute('home')).thenReturn('Welcome!');

        const name = component.friendlyName('home');
        expect(name).toBe('Welcome!');
    });
});
