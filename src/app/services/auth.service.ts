import { Injectable } from '@angular/core';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { LoginComponent } from 'src/app/components/header/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _httpCommonService: HttCommonService, public dialog: MatDialog) { }
    public isAuthenticated(): boolean {

      const token = sessionStorage.getItem('f_login_form');
      console.log('f_login_form'+ token);
      return token !== null;
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
