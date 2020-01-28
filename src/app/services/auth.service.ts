import { Injectable } from '@angular/core';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialog, _countGroupLabelsBeforeOption } from '@angular/material';
import { LoginComponent } from 'src/app/components/header/login/login.component';
import { RegisterUser } from 'src/app/models/RegisterUser';
import { UserService } from 'src/app/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from 'src/app/services/cart.service';
import { WhishlistService } from 'src/app/services/whishlist.service';
import { AuthService as SocilAuthService} from 'angularx-social-login';
import { AlertService } from 'src/app/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _httpCommonService: HttCommonService, public dialog: MatDialog, 
    public _userService: UserService, 
    public cartService: CartService,
    public _whishlistService: WhishlistService,
    public _socioAuthServ: SocilAuthService,
    public _alertService: AlertService) { }
  public isAuthenticated(): boolean {
    const access_token = sessionStorage.getItem('sn');
    return access_token !== null;
  }


  public registerUser(userName?, email?, mobile?, countryCode?, password?, key1?, key2?, key3?): Observable<any> {
    let newUser = new RegisterUser();
    newUser.username = userName;
    newUser.email = email;
    newUser.mobile = '1'+mobile;
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

  public authenticateSocialUser(userJson): Observable<any> {
    return this._httpCommonService.postSocialReq(userJson);
  }  

  public sendEmailOTP(email?, countryCode?, action?): Observable<any> {
    let otpJson = {
      "email": email,
      "countryCode": countryCode,
      "action": action
    }
    return this._httpCommonService.postReq('otp/sendemailotp', otpJson);
  }

  public sendSmsOTP(mobile?, countryCode?, action?): Observable<any> {
    let otpJson = {
      "mobile": '1'+mobile,
      "countryCode": countryCode,
      "action": action
    }
    return this._httpCommonService.postReq('otp/sendsmsotp', otpJson);
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
      "mobile": '1'+mobile,
      "smsOTP": smsOTP,
      "countryCode": countryCode,
      "action": action
    }
    return this._httpCommonService.postReq('otp/validatesmsotp', otpJson);
  }

  public forgotPassword(countryCode?, password?, email?, mobile?): Observable<any> {
    let body = {
      "countryCode": countryCode,
      "password": password,
      "email": email,
      "mobile": '1'+mobile
    }
    return this._httpCommonService.postReq('otp/recoveraccount', body);
  }

  public changePassword(countryCode?, oldpassword?,newpassword?, email?, mobile?): Observable<any> {
    let body = {
      "countryCode": countryCode,
      "oldpassword": oldpassword,
      "password": newpassword,
      "email": email,
      "mobile": '1'+mobile
    }
    return this._httpCommonService.postRequest('otp/recoveraccount', body, this._userService.getAuthToken());
  }

  public fetchAccessToken(): Observable<any> {
    let body = {
      "id": this._userService.getUid()
    }
    return this._httpCommonService.postReq('fetchapi/us', body);
  }

  public refreshAccessToken(): any {
    this.fetchAccessToken().subscribe(
      (authResponse)=>{
        if(authResponse && authResponse.status == 200){
          if(authResponse.responseObjects){
            sessionStorage.setItem("sn", authResponse.responseObjects.sn);
            this._userService.setAuthToken(authResponse.responseObjects.sn);
            return authResponse.responseObjects.sn;
          }
        }
        return '';
      },
      (error : HttpErrorResponse)=>{
        console.log(error);
        //return Observable.throw(error);
        return '';
      }
    );
  }

  public getTokenByRreshToke(){
    //https://itnext.io/angular-tutorial-implement-refresh-token-with-httpinterceptor-bfa27b966f57
  }
  
  logOut(): void {
    
    this._userService.resetDetails();
    this._userService.setAuthToken(null);
    this.cartService.clearCart();
    sessionStorage.removeItem("sn");
    this._whishlistService.clearWhislist();
    this._alertService.raiseAlert("Session time out. Please login to Dealsbargain.");
    this._socioAuthServ.signOut();
  }

}
