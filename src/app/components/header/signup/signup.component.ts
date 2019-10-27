import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import * as CryptoJS from 'crypto-js';
import { EncryptionService } from 'src/app/services/encryption.service';
import { AuthService as UserAuth } from 'src/app/services/auth.service';
import { AuthResopnse } from 'src/app/models/AuthResponse';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(public _socioAuthServ: AuthService,
    public userAuth: UserAuth,
    public dialog: MatDialog,
    public userservice: UserService,
    public matDialogRef: MatDialogRef<SignupComponent>,
    public router: Router,
    public encryptionService: EncryptionService) { }

  ngOnInit() {
  }

  funSignIn() {
    this.funClose();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '600px';
    // this.dialog.open(LoginComponent, dialogConfig);
  }

  funClose() {
    this.matDialogRef.close();
  }

  loginFacebook() {
    this._socioAuthServ.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.funClose();
        this.userservice.response = response;
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
      }
    );
  }

  loginGmail() {
    this._socioAuthServ.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.funClose();
        this.userservice.response = response;
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
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
      this.userservice.form.setValue({ name: userInfo.name, email: userInfo.email, password: ciphertext, mobileno: userInfo.mobileno });
      this.userAuth.registerUser(userInfo.name, userInfo.email, userInfo.mobileno, 'us',
        ciphertext, key1, key2, key3).subscribe(
        (authResponse: AuthResopnse) => {
          sessionStorage.setItem("authResponse", JSON.stringify(authResponse));
          if (authResponse.statusCode === 200) {
            sessionStorage.setItem("success", JSON.stringify(authResponse));
            console.log('Success' + JSON.stringify(authResponse));
          } else {
            sessionStorage.setItem("Failure", JSON.stringify(authResponse));
            console.log('Failed' + JSON.stringify(authResponse));
          }
        });
      sessionStorage.setItem("f_login_form", JSON.stringify(this.userservice.form.value));
      this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
      this.funClose();
    } catch (error) {
      console.log(error);
    }

  }

}
