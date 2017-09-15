import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwt.service';
import { LocalizeRouterService } from './routes-parser-locale-currency/localize-router.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private jwtService: JwtService,
                private localize: LocalizeRouterService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!!this.jwtService.getToken()) {
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate([this.localize.translateRoute('/login')], { queryParams: { returnUrl: state.url } });
        return false;
    }
}

