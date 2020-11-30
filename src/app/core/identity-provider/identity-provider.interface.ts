import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

type TriggerReturnType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

export interface IdentityProviderCapabilities {
  editPassword?: boolean;
  editEmail?: boolean;
  editProfile?: boolean;
}

export interface IdentityProvider {
  /**
   * Initialization logic.
   */
  init(config): void;

  /**
   * Capabilities for the identity provider.
   */
  getCapabilities(): IdentityProviderCapabilities;

  /**
   * Route Guard for login
   */
  triggerLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TriggerReturnType;

  /**
   * Route guard for register. If not provided, login logic is reused.
   */
  triggerRegister?(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TriggerReturnType;

  /**
   * Route guard for logout
   */
  triggerLogout(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TriggerReturnType;

  /**
   * Interceptor for all API requests directed to the ICM
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>;
}
