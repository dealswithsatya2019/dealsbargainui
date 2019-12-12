import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService as UserAuth } from 'src/app/services/auth.service';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  subscriptions: Subscription = new Subscription();
  oldpassword='';
  newpassword = '';
  
  constructor(
    public _alertService: AlertService,
    public _userAuth: UserAuth,
    public _userService: UserService,
    public _router: Router) { }

    ngOnInit() {
    }
  
    ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
    }

    public changePassword() {
      this.subscriptions.add(this._userAuth.changePassword('us',this.oldpassword,this.newpassword,this._userService.getProfileInfo().email,'').subscribe(
        (data) => {
          if (data.statusDesc == 'FORGOT_PASSWORD_UPDATE_SUCCESS') {
            this._alertService.raiseAlert("Password changed successfully.");
            this._router.navigate(['myprofile', { outlets: { 'profileoutlet': ['profileinfo'] } }]);
          } else {
            console.log(data);
            this._alertService.raiseAlert("Failed to update password.");
          }
        },
        (error) => {
          console.log(error);
          this._alertService.raiseAlert("Failed to change password.");
        }
      ));
    }
  
  
}
