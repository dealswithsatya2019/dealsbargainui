import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRole = next.data.datepropsample;
    console.log(expectedRole);
    if (!this.auth.isAuthenticated()) {
      this.auth.funSignIn();
      console.log('Not Authenicted ....');
      return false;
    }
    console.log('Authenicted ....');
    return true;
  }

}
