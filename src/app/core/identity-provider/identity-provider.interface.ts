import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface IdentityProviderCapabilities {
  editPassword?: boolean;
  editEmail?: boolean;
  editProfile?: boolean;
}

export interface IdentityProvider {
  init(config): void;

  getCapabilities(): IdentityProviderCapabilities;

  triggerLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot);

  triggerRegister?(route: ActivatedRouteSnapshot, state: RouterStateSnapshot);

  triggerLogout(route: ActivatedRouteSnapshot, state: RouterStateSnapshot);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>;
}
