import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MyprofileService } from 'src/app/services/myprofile.service';
import { searchreponse } from 'src/app/models/searchResponse';
import { ProfileInfo } from 'src/app/models/ProfileInfo';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileUpdateInfo } from 'src/app/models/ProfileUpdateInfo';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService as UserAuth } from 'src/app/services/auth.service';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit, OnDestroy {

  constructor(public _profileInfoService: MyprofileService, 
    public _alertService: AlertService,
    public _userAuth: UserAuth) { }

  subscriptions: Subscription = new Subscription();
  updatedMobileNumber = '';
  updatedEmail='';
  isSMSEdit=false;
  isEmailEdit=false;
  isSMSOtpSent =false;
  isEmailOtpSent =false;
  smsOTP ='';
  emailOTP='';
  //https://stackoverflow.com/questions/51584265/angular-6-date-format-mm-dd-yyyy-in-reactive-form
  profileform: FormGroup = new FormGroup({
    countryCode: new FormControl('us'),
    action: new FormControl('updateprofile'),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    dob: new FormControl(''),
    email: new FormControl({value: '', disabled: true}),
    mobile: new FormControl({value: '', disabled: true})
  });

  ngOnInit() {
    this.getUserProfile();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  public getUserProfile() {
    this.subscriptions.add(this._profileInfoService.getUserProfile('us').subscribe(
      (data) => {
        if (data.statusDesc == 'USER_FOUND') {
          if(data.responseObject && data.responseObject.length >0){
            this.setProfileFormValues(data.responseObject[0]);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    ));
  }

  public setProfileFormValues(profileInfo: ProfileInfo) {
    this.profileform.controls.firstname.setValue(profileInfo.first_name);
    this.profileform.get('firstname').setValidators([Validators.required, Validators.maxLength(25)]);
    this.profileform.controls.lastname.setValue(profileInfo.last_name);
    this.profileform.get('lastname').setValidators([Validators.required, Validators.maxLength(25)]);
    this.profileform.controls.mobile.setValue(profileInfo.mobile);
    this.profileform.get('mobile').setValidators([Validators.required, Validators.pattern('[0-9]{10}')]);
    this.profileform.controls.email.setValue(profileInfo.email);
    this.profileform.get('email').setValidators([Validators.required,  Validators.required, Validators.email]);

    this.updatedMobileNumber = profileInfo.mobile;
    this.updatedMobileNumber = profileInfo.email;
  }
  public updateUserProfile() {
    this.profileform.controls.mobile.setValue(this.updatedMobileNumber);
    this.profileform.controls.email.setValue(this.updatedMobileNumber);
    let userInfo = JSON.parse(JSON.stringify(this.profileform.value));
    this.subscriptions.add(this._profileInfoService.updateUserProfile(userInfo).subscribe(
      (data) => {
        if (data.statusDesc == 'UPDATE_SUCCESS') {
          this._alertService.raiseAlert("Pofile updated Successfully.");
        }else{
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

  enableSmsOtp(){
    this.isSMSEdit =true;
    this.profileform.get('mobile').enable();
  }
  enableEmailOtp(){
    this.isEmailEdit =true;
    this.profileform.get('email').enable();
  }

  sendSmsOTP(){
    this.isSMSEdit =false;
    this.isSMSOtpSent =true;
    let userInfo = JSON.parse(JSON.stringify(this.profileform.value));
    this._alertService.raiseAlert("OTP sent to mobile numnber : "+userInfo.mobile);
  }

  sendEmailOTP(){
    let userInfo = JSON.parse(JSON.stringify(this.profileform.value));
    this._userAuth.sendOTP(userInfo.mobile, userInfo.email, 'us','updateemail').subscribe(
        (authResponse: AuthResopnse) => {
          if (authResponse.statusCode === 201) {
            
            this.isEmailEdit =false;
            this.isEmailOtpSent =true;
            this._alertService.raiseAlert("OTP sent to email : "+userInfo.email);
          } else {
            this._alertService.raiseAlert(authResponse.statusDesc);
          }
        },
        (error : HttpErrorResponse) =>{
          console.log(error.error.statusDesc);
        });
      
  }

  verifyAndSaveMobileNumber(){
    this.isSMSOtpSent =false;
    this._alertService.raiseAlert("Mobile number updated successfully.");

  }

  verifyAndSaveEmail(){
    let userInfo = JSON.parse(JSON.stringify(this.profileform.value));
    this._userAuth.verifyEmailOTP(userInfo.email, this.emailOTP, 'us','updateemail').subscribe(
        (authResponse: AuthResopnse) => {
          if (authResponse.statusCode === 201) {
            this.isEmailOtpSent =false;
            this.updatedEmail = userInfo.email;
            this._alertService.raiseAlert("Email id updated successfully.");
          } else {
            this._alertService.raiseAlert(authResponse.statusDesc);
            console.log(authResponse);
          }
        },
        (error : HttpErrorResponse) =>{
          console.log(error.error.statusDesc);
        });
  
  }
}
