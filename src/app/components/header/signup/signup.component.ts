import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(public _socioAuthServ: AuthService,public dialog: MatDialog,public userservice : UserService,public matDialogRef: MatDialogRef<SignupComponent>,public router: Router) { }

  ngOnInit() {
  }

  funSignIn() {
    this.funClose();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '600px';
    // this.dialog.open(LoginComponent, dialogConfig);
  }

  funClose() {
    this.matDialogRef.close();
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

  loginGmail() {
    this._socioAuthServ.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.funClose();
        this.userservice.response = response;
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
      }
    );
  } 

  funSubmit() {
    sessionStorage.setItem("f_login_form", JSON.stringify(this.userservice.form.value));
    this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
    this.funClose();
  }

}
