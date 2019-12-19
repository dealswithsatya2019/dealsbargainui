import { Injectable } from '@angular/core';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialog, _countGroupLabelsBeforeOption } from '@angular/material';
import { LoginComponent } from 'src/app/components/header/login/login.component';
import { RegisterUser } from 'src/app/models/RegisterUser';
import { UserService } from 'src/app/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _httpCommonService: HttCommonService, public dialog: MatDialog, public _userService: UserService) { }
  public isAuthenticated(): boolean {
    const access_token = sessionStorage.getItem('access_token');
    return access_token !== null;
  }


  public registerUser(userName?, email?, mobile?, countryCode?, password?, key1?, key2?, key3?): Observable<any> {
    let newUser = new RegisterUser();
    newUser.username = userName;
    newUser.email = email;
    newUser.mobile = mobile;
    newUser.password = password;
    newUser.key = key1 + '#' + key2 + '#' + key3
    newUser.countryCode = countryCode;
    return this._httpCommonService.postReq('register', JSON.stringify(newUser));
  }

  public authenticateUser(userName?, password?, countryCode?, key1?, key2?, key3?): Observable<any> {
    let authJson = {
      "username": userName,
      "password": password,
      "countryCode": countryCode
    }
    return this._httpCommonService.postReq('authenticate', authJson);
  }

  public sendOTP(mobile?, email?, countryCode?, action?): Observable<any> {
    let otpJson = {
      "mobile": mobile,
      "email": email,
      "countryCode": countryCode,
      "action": action,
      "emailOTP": "",
      "smsOTP": ""
    }
    return this._httpCommonService.postReq('otp/sendemailotp', otpJson);
  }

  public verifyEmailOTP(email?, emailOTP?, countryCode?, action?): Observable<any> {
    let otpJson = {
      "email": email,
      "emailOTP": emailOTP,
      "countryCode": countryCode,
      "action": action
    }
    return this._httpCommonService.postReq('otp/validateemailotp', otpJson);
  }

  public verifySmsOTP(mobile?, smsOTP?, countryCode?, action?): Observable<any> {
    let otpJson = {
      "mobile": mobile,
      "smsOTP": smsOTP,
      "countryCode": countryCode,
      "action": action
    }
    return this._httpCommonService.postReq('otp/sendsmsotp', otpJson);
  }

  public forgotPassword(countryCode?, password?, email?, mobile?): Observable<any> {
    let body = {
      "countryCode": countryCode,
      "password": password,
      "email": email,
      "mobile": mobile
    }
    return this._httpCommonService.postRequest('otp/forgotpassword', body, this._userService.getAuthToken());
  }

  public changePassword(countryCode?, oldpassword?,newpassword?, email?, mobile?): Observable<any> {
    let body = {
      "countryCode": countryCode,
      "oldpassword": oldpassword,
      "password": newpassword,
      "email": email,
      "mobile": mobile
    }
    return this._httpCommonService.postRequest('otp/forgotpassword', body, this._userService.getAuthToken());
  }

}
