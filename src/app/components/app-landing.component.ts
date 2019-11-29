import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { HttCommonService } from '../services/httpcommon.service';
import { IMaps } from '../models/IMaps';

@Component({
  selector: 'app-landing',
  templateUrl: './app-landing.component.html',
  styleUrls: ['./app-landing.component.scss']
})
export class AppLandingComponent implements OnInit {

  imapsObj: IMaps;
  error: any;

  constructor(public userservice: UserService, public _router: Router, private httpService: HttCommonService) { }

  ngOnInit() {
    let sessioninfo = sessionStorage.getItem("f_login_form");
    this.userservice.response = sessioninfo;
    // this._router.navigateByUrl('/mycart')
    this.httpService.getMapsServiceImaps()
      .subscribe(
        (data: IMaps) => {
          this.imapsObj = data;
          console.log("data" ,data);
        },
        error => this.error = error
      );


  }

}
