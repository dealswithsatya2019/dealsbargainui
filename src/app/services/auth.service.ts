import { Injectable } from '@angular/core';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialog, _countGroupLabelsBeforeOption } from '@angular/material';
import { LoginComponent } from 'src/app/components/header/login/login.component';
import { RegisterUser } from 'src/app/models/RegisterUser';

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

  public registerUser(userName?,email?, mobile?, countryCode?, password?, key1?,key2?,key3?): Observable<any> {
    let newUser = new RegisterUser();
    newUser.username = userName;
    newUser.email = email;
    newUser.mobile = mobile;
    newUser.password = password;
    newUser.key= key1+'#'+key2+'#'+key3
    newUser.countryCode = countryCode;
    return this._httpCommonService.postReq('register', JSON.stringify(newUser));
  }

  public authenticateUser(userName?,password?,countryCode?, key1?,key2?,key3?): Observable<any> {
    let authJson = {
      "username":userName,
      "password":password,
      "countryCode": countryCode
    }
    return this._httpCommonService.postReq('authenticate', authJson);
  }

}
