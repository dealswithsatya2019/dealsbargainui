import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { MyprofileService } from 'src/app/services/myprofile.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/user.service';
import { AuthService as UserAuth } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<ForgotpasswordComponent>,
    public _profileInfoService: MyprofileService,
    public _alertService: AlertService,
    public _userAuth: UserAuth,
    public _userService: UserService) { }

  subscriptions: Subscription = new Subscription();
  emailOrMobile: string = '';
  isEmailOtpSent = false;
  emailOTP = '';
  password = '';
  emailOrMobileReqerrorMsg = '';
  emailOTPReqerrorMsg = '';
  passwordReqerrorMsg = '';

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  funClose() {
    this.matDialogRef.close();
  }



  sendOTP() {
    if (this.emailOrMobile.length == 0) {
      this.emailOrMobileReqerrorMsg = "* Email or mobile number is required.";
      return;
    }
    this.emailOrMobileReqerrorMsg = '';
    if (Math.sign(Number(this.emailOrMobile))) {
        if(Math.sign(Number(this.emailOrMobile))>0 &&  this.emailOrMobile.length == 10){
          this.funsendSmsOtp();
        }else{
          this._alertService.raiseAlert("Please enter valid mobile number.");
        }
    } else {
      this.funsendEmailOtp();
    }
  }

  funsendEmailOtp() {
    this._userAuth.sendEmailOTP(this.emailOrMobile, 'us', 'forgotpassword').subscribe(
      (authResponse: AuthResopnse) => {
        if (authResponse.statusCode === 201) {
          this.isEmailOtpSent = true;
          this._alertService.raiseAlert("OTP sent " + this.emailOrMobile);
        } else {
          this._alertService.raiseAlert("Please try again...");
          console.log(authResponse.statusDesc)
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.error.statusDesc);
      });

  }

  funsendSmsOtp() {
    this._userAuth.sendSmsOTP(this.emailOrMobile, 'us', 'forgotpassword').subscribe(
      (authResponse: AuthResopnse) => {
        if (authResponse.statusCode === 201) {
          this.isEmailOtpSent = true;
          this._alertService.raiseAlert("OTP sent " + this.emailOrMobile);
        } else {
          this._alertService.raiseAlert("Please try again...");
          console.log(authResponse.statusDesc)
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.error.statusDesc);
      });

  }

  verifyAndSavePassowrd() {
    if (this.emailOTP.length == 0) {
      this.emailOTPReqerrorMsg = "* OTP required.";
      return;
    }
    this.emailOTPReqerrorMsg = '';
    if (this.password.length == 0) {
      this.passwordReqerrorMsg = "* Password required.";
      return;
    }
    this.passwordReqerrorMsg = '';
    if (Math.sign(Number(this.emailOrMobile)) && Math.sign(Number(this.emailOrMobile))>0 &&  this.emailOrMobile.length == 10){
      this.verifySmsOtp();
    }else{
      this.verifyEmailOtp();
    }

  }

  public verifyEmailOtp() {
    this._userAuth.verifyEmailOTP(this.emailOrMobile, this.emailOTP, 'us', 'forgotpassword').subscribe(
      (authResponse: AuthResopnse) => {
        if (authResponse.statusCode === 201) {
          this.updateNewPassowrd();
        } else {
          this._alertService.raiseAlert("You entered an invalid OTP");
          console.log(authResponse);
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.error.statusDesc);
      });
  }

  public verifySmsOtp() {
    this._userAuth.verifySmsOTP(this.emailOrMobile, this.emailOTP, 'us', 'forgotpassword').subscribe(
      (authResponse: AuthResopnse) => {
        if (authResponse.statusCode === 201) {
          this.updateNewPassowrd();
        } else {
          this._alertService.raiseAlert("You entered an invalid OTP");
          console.log(authResponse);
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.error.statusDesc);
      });
  }

  public updateNewPassowrd() {
    this.subscriptions.add(this._userAuth.forgotPassword('us', this.password, this.emailOrMobile, '').subscribe(
      (data) => {
        if (data.statusDesc == 'FORGOT_PASSWORD_UPDATE_SUCCESS') {
          this.isEmailOtpSent = false;
          this._alertService.raiseAlert("Password resets successfully.");
          this.funClose();
        } else {
          console.log(data);
          this._alertService.raiseAlert("Failed to update new password.");
        }
      },
      (error) => {
        console.log(error);
        this._alertService.raiseAlert("Failed to update new password.");
      }
    ));
  }


}
