import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './app-landing.component.html',
  styleUrls: ['./app-landing.component.scss']
})
export class AppLandingComponent implements OnInit {

  constructor(public userservice : UserService) { }

  ngOnInit() {
    let sessioninfo =  sessionStorage.getItem("f_login_form");
    this.userservice.response = sessioninfo;
        
  }

}
