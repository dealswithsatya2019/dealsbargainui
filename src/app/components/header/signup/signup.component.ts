import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import * as CryptoJS from 'crypto-js';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import { AuthService as UserAuth } from 'src/app/services/auth.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { UserService } from 'src/app/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WhishlistService } from 'src/app/services/whishlist.service';
import { Validators } from '@angular/forms';
import { MyprofileService } from 'src/app/services/myprofile.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpErrorMsg : string = '';
  issentotp: boolean =false;
  public snackBarConfig: MatSnackBarConfig;	  
  constructor(public _socioAuthServ: AuthService,
    public userAuth: UserAuth,
    public dialog: MatDialog,
    public userservice: UserService,
    public router: Router,
    public encryptionService: EncryptionService,
    public  whishlistService: WhishlistService,
    public _userSerive: UserService,
    private _snackBar: MatSnackBar,
    public _profileInfoService: MyprofileService,
  ) { 
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = "center";
    this.snackBarConfig.verticalPosition = "top";
    this.snackBarConfig.duration = 200000;
  }

  ngOnInit() {
    this.userservice.resetForm();
  }
  raiseAlert(message : string){
    this._snackBar.open(message, "", this.snackBarConfig);
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
        this.whishlistService.updateWhishlist();
      }
    );
  }

  loginGmail() {
    this._socioAuthServ.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        // this.funClose();
        this.userservice.response = response;
        this.whishlistService.updateWhishlist();
      }
    );
  }

  funRegister() {
    try {
      if(this.issentotp === true){
        //Register
        this.funVerifyEmailOTP();
        /*if(this.funVerifyEmailOTP()){
          this.funRegisterUser();
        }*/

      }else{
        this.issentotp=true;
        this.funSendOTP();
      }
    } catch (error) {
      console.log(error);
    }

  }

  funVerifyEmailOTP() : any{
    let userInfo = JSON.parse(JSON.stringify(this.userservice.form.value));
    this.userAuth.verifyEmailOTP(userInfo.email, userInfo.emailotp, 'us','signup').subscribe(
        (authResponse: AuthResopnse) => {
          sessionStorage.setItem("authResponse", JSON.stringify(authResponse));
          if (authResponse.statusCode === 201) {
            this.funRegisterUser();
            return true;
            
          } else {
            this.raiseAlert(authResponse.statusDesc);
            console.log('Failed' + JSON.stringify(authResponse));
            return false;
          }
        },
        (error : HttpErrorResponse) =>{
          this.userservice.form.controls['password'].setValue(userInfo.password);
          console.log(error.error.statusDesc);
          return false;
        });
  }
  funSendOTP(){
    let userInfo = JSON.parse(JSON.stringify(this.userservice.form.value));
    this.userAuth.sendOTP(userInfo.mobileno, userInfo.email, 'us','signup').subscribe(
        (authResponse: AuthResopnse) => {
          sessionStorage.setItem("authResponse", JSON.stringify(authResponse));
          if (authResponse.statusCode === 201) {
            this.raiseAlert("OTP sent to both mobile number : "+userInfo.mobileno+" and email id"+ userInfo.email);
            //Call sentsmsemail otp api.
            this.userservice.form.get('emailotp').setValidators([Validators.required]);
            this.userservice.form.get('smsotp').setValidators([Validators.required]);
          } else {
            this.raiseAlert(authResponse.statusDesc);
            sessionStorage.setItem("Failure", JSON.stringify(authResponse));
            console.log('Failed' + JSON.stringify(authResponse));
          }
        },
        (error : HttpErrorResponse) =>{
          this.userservice.form.controls['password'].setValue(userInfo.password);
          console.log(error.error.statusDesc);
        });
      
  }

  funRegisterUser(){
    
      let userInfo = JSON.parse(JSON.stringify(this.userservice.form.value));
      var key1 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
      var key2 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
      var key3 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
      var rawciphertext = this.encryptionService.encrypt(key2, key3, key1, userInfo.password.toString());
      var ciphertext = CryptoJS.enc.Base64.stringify(rawciphertext);
      this.userservice.form.controls['password'].setValue(ciphertext);
      this.userAuth.registerUser(userInfo.name, userInfo.email, userInfo.mobileno, 'us',
        ciphertext, key1, key2, key3).subscribe(
        (authResponse: AuthResopnse) => {
          sessionStorage.setItem("authResponse", JSON.stringify(authResponse));
          if (authResponse.statusCode === 200) {
            sessionStorage.setItem("access_token", authResponse.responseObjects.access_token);
            this._userSerive.setAuthToken(authResponse.responseObjects.access_token);
            console.log('Success' + JSON.stringify(authResponse));
            this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
            this._profileInfoService.funSetUserProfile();
            // this.funClose();
            this.whishlistService.updateWhishlist();
            this.issentotp=false;
            this.userservice.form.get('smsotp').clearValidators();
            this.router.navigateByUrl('/home');
          } else {
            this.userservice.form.controls['password'].setValue(userInfo.password);
            //this.userservice.form.setValue({ name: userInfo.name, email: userInfo.email, password: userInfo.password, mobileno: userInfo.mobileno });
            this.raiseAlert(authResponse.statusDesc);
            sessionStorage.setItem("Failure", JSON.stringify(authResponse));
            console.log('Failed' + JSON.stringify(authResponse));
          }
        },
        (error : HttpErrorResponse) =>{
          this.userservice.form.controls['password'].setValue(userInfo.password);
          console.log(error.error.statusDesc);
        });
  }

}
