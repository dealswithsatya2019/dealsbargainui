import { Component, OnInit } from '@angular/core';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatDialogConfig } from '@angular/material';
import { MatDialog } from '@angular/material';
import { SignupComponent } from 'src/app/components/header/signup/signup.component';
import * as CryptoJS from 'crypto-js';
import { EncryptionService } from 'src/app/services/encryption.service';
import { AuthService as UserAuth } from 'src/app/services/auth.service';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import { LoginformService } from 'src/app/services/forms/loginform.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginErrorMsg: string;
  constructor(public dialog: MatDialog, 
              public userservice : UserService,
              public loginformService : LoginformService,
              public _socioAuthServ: AuthService,
              public userAuth: UserAuth,
              public matDialogRef: MatDialogRef<LoginComponent>,
              public router: Router,
              public encryptionService: EncryptionService) { }

  ngOnInit() {
  }

  loginFacebook() {
    this._socioAuthServ.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.funClose();
        this.loginformService.response = response;
        this.userservice.response = JSON.parse(JSON.stringify(response));
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
      }
    );
  }

  funClose() {
    this.matDialogRef.close();
  }

  loginGmail() {
    this._socioAuthServ.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.funClose();
        this.loginformService.response = response;
        this.userservice.response = JSON.parse(JSON.stringify(response));
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
      }
    );
  } 

  funSignUp() {
    this.funClose();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '600px';
    this.dialog.open(SignupComponent, dialogConfig);
  }

  funLogin() {
    let userInfo = JSON.parse(JSON.stringify(this.loginformService.form.value));
    var key1 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
    var key2 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
    var key3 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));

    var ciphertext = this.encryptionService.encrypt(key2, key3, key1, userInfo.password);
    //this.userservice.form.setValue({ password: ciphertext });
    this.userAuth.authenticateUser(userInfo.name, userInfo.password, 'us', key1, key2, key3).subscribe(
      (authResponse: AuthResopnse) => {
        if(authResponse.statusCode === 200){
          this.userservice.form.setValue({
            name: userInfo.name,
            email: null,
            password:null,
            mobileno:null
          });
          console.log('Success' + JSON.stringify(authResponse));
          sessionStorage.setItem("access_token", authResponse.responseObjects.access_token);
          sessionStorage.setItem("f_login_form", JSON.stringify(this.userservice.form.value));
          this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
          this.loginformService.response = JSON.parse(JSON.stringify(this.loginformService.form.value));
          this.funClose();
        }else{
          this.loginErrorMsg = authResponse.statusDesc;
          console.log('Failed' + JSON.stringify(authResponse));
        }
      });
  }
}
