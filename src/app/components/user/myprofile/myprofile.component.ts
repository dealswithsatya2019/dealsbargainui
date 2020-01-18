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
import { UserService } from 'src/app/user.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit, OnDestroy {

  constructor(public _profileInfoService: MyprofileService, 
    public _alertService: AlertService,
    public _userAuth: UserAuth,
    public _userService: UserService,
    public datepipe: DatePipe) { }

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

  doboldvalue: string = '';
  minFromDate= new Date();//[min]="minFromDate" 
  private MIN_AGE_RULE = environment.MIN_AGE_RULE;

  ngOnInit() {
    this.setProfileFormValues(this._userService.getProfileInfo());
    this.profileform.controls["dob"].valueChanges.subscribe(selectedValue => {
     this.doboldvalue=this.profileform.value['dob'];
   });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  date(e) {
    //var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    var convertDate = this.datepipe.transform(e.target.value, 'yyyy-MM-dd');
    var minAge=new Date();
    minAge.setFullYear(minAge.getFullYear() - this.MIN_AGE_RULE);
    minAge.setHours(0);minAge.setMinutes(0);minAge.setSeconds(0);
    let newvalue: any;
    if(minAge < e.target.value){
      this._alertService.raiseAlert("Age per terms & conditions your age should be greather than or equals to "+this.MIN_AGE_RULE);
      newvalue='';
    }else{
      newvalue = convertDate;
    }
    this.profileform.get('dob').setValue(newvalue, {
      onlyself: true
    })
  }

  public setProfileFormValues(profileInfo: ProfileInfo) {
    this.profileform.controls.firstname.setValue(profileInfo.first_name);
    this.profileform.get('firstname').setValidators([Validators.required, Validators.maxLength(25)]);
    this.profileform.controls.lastname.setValue(profileInfo.last_name);
    this.profileform.get('lastname').setValidators([Validators.required, Validators.maxLength(25)]);
    console.log(profileInfo.created_on);
    if(profileInfo.dob){
      //var convertDate = new Date(profileInfo.dob).toISOString().substring(0, 10);
      var convertDate = this.datepipe.transform(profileInfo.dob, 'yyyy-MM-dd');
      //console.log(this.datepipe.transform(date, 'dd/MM/yyyy'));
      this.profileform.controls.dob.setValue(convertDate, {onlyself : true});
    }
    this.profileform.controls.mobile.setValue(profileInfo.mobile);
    this.profileform.get('mobile').setValidators([Validators.required, Validators.pattern('[0-9]{10}')]);
    this.profileform.controls.email.setValue(profileInfo.email);
    this.profileform.get('email').setValidators([Validators.required,  Validators.required, Validators.email]);

    this.updatedMobileNumber = profileInfo.mobile;
    this.updatedEmail = profileInfo.email;
  }

  /**
   * In form for disabled values while getting form as value then it should be enabled.
   * @param isEnable 
   */
  enableOrDisable(isEnable){
    if(isEnable){
      this.profileform.get('mobile').enable();
      this.profileform.get('email').enable();
    }else{
      this.profileform.get('mobile').disable();
      this.profileform.get('email').disable();
    }
  }
  public updateUserProfile() {
    this.enableOrDisable(true);
    this.profileform.controls.mobile.setValue(this.updatedMobileNumber);
    this.profileform.controls.email.setValue(this.updatedEmail);
    let userInfo = JSON.parse(JSON.stringify(this.profileform.value));
    this.enableOrDisable(false);
    this.subscriptions.add(this._profileInfoService.updateUserProfile(userInfo).subscribe(
      (data) => {
        if (data.statusDesc == 'UPDATE_SUCCESS') {
          this._alertService.raiseAlert("Pofile updated Successfully.");
          this._profileInfoService.funSetUserProfile();
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

  cancelMobileUpdate(){
    this.isSMSEdit =false;
    this.isSMSOtpSent =false;
    this.profileform.controls.mobile.setValue(this.updatedMobileNumber);
    this.profileform.get('mobile').disable();
  }

  cancelEmailUpdate(){
    this.isEmailEdit =false;
    this.isEmailOtpSent =false;
    this.profileform.controls.email.setValue(this.updatedEmail);
    this.profileform.get('email').disable();
  }  
  
  sendSmsOTP(){
    this.isSMSEdit =false;
    this.isSMSOtpSent =true;
    this.enableOrDisable(true);
    let userInfo = JSON.parse(JSON.stringify(this.profileform.value));
    this.enableOrDisable(false);
    this._userAuth.sendSmsOTP(userInfo.mobile, 'us','updateemail').subscribe(
      (authResponse: AuthResopnse) => {
        if (authResponse.statusCode === 201) {
          this.isEmailEdit =false;
          this.isEmailOtpSent =true;
          this._alertService.raiseAlert("OTP sent to mobile number : "+userInfo.mobile);
        } else {
          this._alertService.raiseAlert(authResponse.statusDesc);
        }
      },
      (error : HttpErrorResponse) =>{
        console.log(error.error.statusDesc);
      });
  }

  sendEmailOTP(){
    this.enableOrDisable(true);
    let userInfo = JSON.parse(JSON.stringify(this.profileform.value));
    this.enableOrDisable(false);
    this._userAuth.sendEmailOTP(userInfo.email, 'us','updateemail').subscribe(
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
    this.enableOrDisable(true);
    let userInfo = JSON.parse(JSON.stringify(this.profileform.value));
    this.enableOrDisable(false);
    this._userAuth.verifySmsOTP(userInfo.mobile, this.smsOTP, 'us','updateemail').subscribe(
        (authResponse: AuthResopnse) => {
          if (authResponse.statusDesc === 'OTP_MATCHED') {
            this.isSMSOtpSent =false;
            this.updatedMobileNumber = userInfo.mobile;
            this.profileform.get('mobile').disable();
            this._profileInfoService.funSetUserProfile();
            this._alertService.raiseAlert("Mobile number updated successfully.");
          } else if (authResponse.statusDesc === 'OTP_NOT_MATCHED') {
            this._alertService.raiseAlert("OTP not matched. Please enter valid OTP.");
          } else {
            this._alertService.raiseAlert(authResponse.statusDesc);
            console.log(authResponse);
          }
        },
        (error : HttpErrorResponse) =>{
          console.log(error.error.statusDesc);
        });

  }

  verifyAndSaveEmail(){
    this.enableOrDisable(true);
    let userInfo = JSON.parse(JSON.stringify(this.profileform.value));
    this.enableOrDisable(false);
    this._userAuth.verifyEmailOTP(userInfo.email, this.emailOTP, 'us','updateemail').subscribe(
        (authResponse: AuthResopnse) => {
          if (authResponse.statusDesc === 'OTP_MATCHED') {
            this.isEmailOtpSent =false;
            this.updatedEmail = userInfo.email;
            this.profileform.get('email').disable();
            this._profileInfoService.funSetUserProfile();
            this._alertService.raiseAlert("Email id updated successfully.");
          } else if (authResponse.statusDesc === 'OTP_NOT_MATCHED') {
            this._alertService.raiseAlert("OTP not matched. Please enter valid OTP.");
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
