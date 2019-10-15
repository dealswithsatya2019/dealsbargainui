import { Component, OnInit } from '@angular/core';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public userservice : UserService,public _socioAuthServ: AuthService,public matDialogRef: MatDialogRef<LoginComponent>,public router: Router) { }

  ngOnInit() {
  }

  loginFacebook() {
    this._socioAuthServ.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.funClose();
        this.userservice.response = response;
      }
    );
  }

  funClose() {
    this.matDialogRef.close();
  }

  loginGmail() {
    this._socioAuthServ.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.funClose();
        this.userservice.response = response;
      }
    );
  } 

  funSubmit() {
    sessionStorage.setItem("f_login_form", JSON.stringify(this.userservice.form.value));
    this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
    this.funClose();
  }
}
