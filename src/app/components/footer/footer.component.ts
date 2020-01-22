import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public _router: Router,
    public userservice: UserService,
    public _alertService: AlertService) { }

  ngOnInit() {
  }

  navigatetoMyProfile(){
    if (this.userservice.getAuthToken()) {
      this._router.navigate(['myprofile', { outlets: { 'profileoutlet': ['profileinfo'] } }]);
    } else {
      this._alertService.raiseAlert("Please login to continue my account")
      this._router.navigateByUrl("/login");
    } 
  }

}
