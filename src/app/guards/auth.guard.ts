import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { LoginComponent } from 'src/app/components/header/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router,
    public dialog: MatDialog) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    /*const expectedRole = next.data.datepropsample;
    console.log(expectedRole);*/
    if (!this.auth.isAuthenticated()) {
      this.funSignIn();
      //console.log('Not Authenicted ....');
      return false;
    }
   // console.log('Authenicted ....');
    return true;
  }

  public funSignIn() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '600px';
    this.dialog.open(LoginComponent, dialogConfig);
  }

}
