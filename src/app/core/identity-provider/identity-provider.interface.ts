import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface IdentityProviderCapabilities {
  editPassword?: boolean;
  editEmail?: boolean;
  editProfile?: boolean;
}

export type TriggerReturnType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

export interface IdentityProvider {
  init(config): void;

  getCapabilities(): IdentityProviderCapabilities;

  triggerLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TriggerReturnType;

  triggerRegister?(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TriggerReturnType;

  triggerLogout(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TriggerReturnType;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>;
}
