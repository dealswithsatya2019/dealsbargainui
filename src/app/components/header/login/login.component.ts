import { Component, OnInit } from '@angular/core';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatDialogConfig } from '@angular/material';
import { MatDialog } from '@angular/material';
import { SignupComponent } from 'src/app/components/header/signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public dialog: MatDialog,public userservice : UserService,public _socioAuthServ: AuthService,public matDialogRef: MatDialogRef<LoginComponent>,public router: Router) { }

  ngOnInit() {
  }

  loginFacebook() {
    this._socioAuthServ.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.funClose();
        this.userservice.response = response;
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
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
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
      }
    );
  } 

  funSignUp() {
    this.funClose();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '600px';
    this.dialog.open(SignupComponent, dialogConfig);
  }

  funSubmit() {
    sessionStorage.setItem("f_login_form", JSON.stringify(this.userservice.form.value));
    this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
    this.funClose();
  }
}
