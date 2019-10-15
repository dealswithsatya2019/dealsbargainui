import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { LoginComponent } from 'src/app/components/header/login/login.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(public dialog: MatDialog,public userservice : UserService,public matDialogRef: MatDialogRef<SignupComponent>,public router: Router) { }

  ngOnInit() {
  }

  funSignIn() {
    this.funClose();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '600px';
    this.dialog.open(LoginComponent, dialogConfig);
  }

  funClose() {
    this.matDialogRef.close();
  }

}
