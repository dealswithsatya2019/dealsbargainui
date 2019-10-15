import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  response: any;

  constructor() { }

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    name: new FormControl('', [Validators.required,Validators.email]),
  });

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      name: ''
    });
  }

}
