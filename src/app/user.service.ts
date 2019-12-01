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
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required]),
    mobileno: new FormControl('',[Validators.required])
  });
 
  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      name: 'sdjflsdjfklsdjfsdkl'
    });
  }

  public setAuthToken(authToken){
    this.authToken = authToken;
  }

  public getAuthToken(){
    return this.authToken;
  }

}
