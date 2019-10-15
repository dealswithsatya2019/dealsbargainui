import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public userservice : UserService,public _socioAuthServ: AuthService) { }
  //css : "3px double yellow";
  ngOnInit() {
  }

  funUpdate() {
    console.log(JSON.stringify(this.userservice.form.value));
    sessionStorage.setItem("f_login_form", JSON.stringify(this.userservice.form.value));
    this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
  }
}
