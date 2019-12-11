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
  emailOrMobile ='';
  isEmailOtpSent = false;
  emailOTP = '';
  password = '';
  
  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  funClose() {
    this.matDialogRef.close();
  }


  
  sendEmailOTP() {
    this._userAuth.sendOTP('', this.emailOrMobile, 'us', 'forgotpassword').subscribe(
      (authResponse: AuthResopnse) => {
        if (authResponse.statusCode === 201) {
          this.isEmailOtpSent = true;
          this._alertService.raiseAlert("OTP sent to email : " + this.emailOrMobile);
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

  public updateNewPassowrd() {
    this.subscriptions.add(this._userAuth.forgotPassword('us',this.password,this.emailOrMobile,'').subscribe(
      (data) => {
        if (data.statusDesc == 'UPDATE_SUCCESS') {
          this.isEmailOtpSent = false;
          this._alertService.raiseAlert("Password resets successfully.");
          this.funClose();
        } else {
          console.log(data);
          this._alertService.raiseAlert("Failed to update profile.");
        }
      },
      (error) => {
        console.log(error);
        this._alertService.raiseAlert("Failed to update profile.");
      }
    ));
  }


}
