import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  response: any;
  private authToken: string;

  constructor() {
    let accessToken = sessionStorage.getItem("access_token");
    if(accessToken !== null){
      this.authToken = accessToken;
    }
   }

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.minLength(8)]),
    mobilenoperfix: new FormControl({value: '+1', disabled: true},[Validators.required]),
    mobileno: new FormControl('',[Validators.required,Validators.pattern('[0-9]{10}')]),
    aggreecbx: new FormControl(false,[Validators.requiredTrue]),
    issentotp: new FormControl(false),
    smsotp: new FormControl(''),
    emailotp: new FormControl('')
  });
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
  
  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      name: ''
    });
  }

  public setAuthToken(authToken){
    this.authToken = authToken;
  }

  public getAuthToken(){
    return this.authToken;
  }

}
