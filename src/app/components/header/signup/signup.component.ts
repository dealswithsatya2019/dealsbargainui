import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import * as CryptoJS from 'crypto-js';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import { AuthService as UserAuth } from 'src/app/services/auth.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { UserService } from 'src/app/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WhishlistService } from 'src/app/services/whishlist.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpErrorMsg : string = '';
  constructor(public _socioAuthServ: AuthService,
    public userAuth: UserAuth,
    public dialog: MatDialog,
    public userservice: UserService,
    public router: Router,
    public encryptionService: EncryptionService,
    public  whishlistService: WhishlistService,
    public _userSerive: UserService
  ) { }

  ngOnInit() {
  }

  funSignIn() {
    // this.funClose();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '430px';
    dialogConfig.height = '600px';
    // this.dialog.open(LoginComponent, dialogConfig);
  }


  loginFacebook() {
    this._socioAuthServ.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (response) => {
        // this.funClose();
        this.userservice.response = response;
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
        this.whishlistService.updateWhishlist();
      }
    );
  }8

  loginGmail() {
    this._socioAuthServ.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        // this.funClose();
        this.userservice.response = response;
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
        this.whishlistService.updateWhishlist();
      }
    );
  }

  funRegister() {
    try {

      let userInfo = JSON.parse(JSON.stringify(this.userservice.form.value));
      var key1 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
      var key2 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
      var key3 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
      var rawciphertext = this.encryptionService.encrypt(key2, key3, key1, userInfo.password.toString());
      var ciphertext = CryptoJS.enc.Base64.stringify(rawciphertext);
      this.userservice.form.setValue({ name: userInfo.name, email: userInfo.email, password: ciphertext, mobileno: userInfo.mobileno,aggreecbx:userInfo.aggreecbx });
      this.userAuth.registerUser(userInfo.name, userInfo.email, userInfo.mobileno, 'us',
        ciphertext, key1, key2, key3).subscribe(
        (authResponse: AuthResopnse) => {
          sessionStorage.setItem("authResponse", JSON.stringify(authResponse));
          if (authResponse.statusCode === 200) {
            sessionStorage.setItem("access_token", authResponse.responseObjects.access_token);
            this._userSerive.setAuthToken(authResponse.responseObjects.access_token);
            console.log('Success' + JSON.stringify(authResponse));
            sessionStorage.setItem("f_login_form", JSON.stringify(this.userservice.form.value));
            this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
            this.signUpErrorMsg = '';
            // this.funClose();
            this.whishlistService.updateWhishlist();
          } else {
            //this.userservice.form.setValue({ name: userInfo.name, email: userInfo.email, password: userInfo.password, mobileno: userInfo.mobileno });
            this.signUpErrorMsg = authResponse.statusDesc;
            sessionStorage.setItem("Failure", JSON.stringify(authResponse));
            console.log('Failed' + JSON.stringify(authResponse));
          }
        },
        (error : HttpErrorResponse) =>{
          this.signUpErrorMsg = error.error.statusDesc;
        });
    } catch (error) {
      console.log(error);
    }

  }

}
