import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LoginformService {

  response: any;

  constructor() { }

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required])
  });
 
}
