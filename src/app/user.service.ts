import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileInfo } from 'src/app/models/ProfileInfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  response: any;
  private authToken: string;
  private uid: string;
  private profileInfo: ProfileInfo = new ProfileInfo();

  constructor() {
<<<<<<< HEAD
    let accessToken = sessionStorage.getItem("sn");
    if(accessToken !== null){
=======
    let accessToken = sessionStorage.getItem("access_token");
    if (accessToken !== null) {
>>>>>>> 642a1e52457144c907eafdc55e700656b13030c7
      this.authToken = accessToken;
    }
  }

  resetDetails() {
    this.response = null;
    this.setAuthToken('');
    this.profileInfo = new ProfileInfo();
    this.uid=null;
    this.resetForm();
  }

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.minLength(8)]),
    mobilenoperfix: new FormControl({value: '+1', disabled: true},[Validators.required]),
    mobileno: new FormControl('',[Validators.required,Validators.pattern('[0-9]{10}')]),
    //aggreecbx: new FormControl(true),
    issentotp: new FormControl(false),
    smsotp: new FormControl(''),
    emailotp: new FormControl('')
  });

  resetForm(){
 /*   this.form.controls['name'].reset();
    this.form.controls['email'].reset();
    this.form.controls['password'].reset();
    this.form.controls['mobilenoperfix'].reset();
    this.form.controls['mobilenoperfix'].setValue('+1');
    this.form.controls['mobileno'].reset();
    //this.form.controls['aggreecbx'].reset();
    //this.form.controls['aggreecbx'].setValue(true);
    this.form.controls['issentotp'].reset();
    this.form.controls['smsotp'].reset();
    this.form.controls['emailotp'].reset();
    this.form.invalid;*/
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required,Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required,Validators.minLength(8)]),
      mobilenoperfix: new FormControl({value: '+1', disabled: true},[Validators.required]),
      mobileno: new FormControl('',[Validators.required,Validators.pattern('[0-9]{10}')]),
      //aggreecbx: new FormControl(true),
      issentotp: new FormControl(false),
      smsotp: new FormControl(''),
      emailotp: new FormControl('')
    });
  
  }
  //https://angular-templates.io/tutorials/about/angular-forms-and-validations
  //Email pattern : Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
  //Password pattern: Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$') //this is for the letters (both uppercase and lowercase) and numbers validation
  signup_validation_messages = {
    'name': [
      { type: 'required', message: 'Username is required' },
      { type: 'maxlength', message: 'Username cannot be more than 20 characters long' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Enter a valid email' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ],
    'mobileno': [
      { type: 'required', message: 'Mobile number is required' },
      { type: 'pattern', message: 'Enter valid 10 digits mobile number' }
    ],
    'aggreecbx': [
      { type: 'requiredTrue', message: 'You must accept terms and conditions' }
    ],
    'smsotp': [
      { type: 'required', message: 'OTP must be required' }
    ],
    'emailotp': [
      { type: 'required', message: 'OTP must be required' }
    ]

  }

<<<<<<< HEAD
  public setAuthToken(authToken){
    let authVal = authToken.split(':',-2);
    if(authVal.length==2){
      this.setUid(authVal[0]);
      this.authToken = authVal[1];
    }else{
=======

  public setAuthToken(authToken) {
    if (authToken != null && authToken != undefined && authToken.indexOf(":") > 0) {
      let token = authToken.split(":")[1];
      this.authToken = token;
    } else {
>>>>>>> 642a1e52457144c907eafdc55e700656b13030c7
      this.authToken = authToken;
    }
  }

  public getAuthToken() {
    return this.authToken;
  }

<<<<<<< HEAD
  
  public getUid(){
    return this.authToken;
  }

  public setUid(uid){
    this.uid =uid;
  }

  public getProfileInfo(){
=======
  public getProfileInfo() {
>>>>>>> 642a1e52457144c907eafdc55e700656b13030c7
    return this.profileInfo;
  }

  public setProfileInfo(profileInfo: ProfileInfo) {
    return this.profileInfo.setValues(profileInfo);
  }

}
