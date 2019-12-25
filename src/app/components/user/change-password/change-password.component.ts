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
  pwdErrorMsg='';
  oldpassword='';
  newpassword = '';
  reenternewpassword='';
  
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
      if(this.oldpassword.length==0){
        this.pwdErrorMsg="Current password required";
        return;
      }else if(this.newpassword.length==0){
        this.pwdErrorMsg="New password required";
        return;
      }else if(this.reenternewpassword.length==0){
        this.pwdErrorMsg="Reenter new password required";
        return;
      }else if(this.newpassword !== this.reenternewpassword){
        this.pwdErrorMsg="Passwords do not match";
        return;
      }
      this.pwdErrorMsg ="";
      this.subscriptions.add(this._userAuth.changePassword('us',this.oldpassword,this.newpassword,this._userService.getProfileInfo().email,'').subscribe(
        (data) => {
          if (data.statusDesc == 'FORGOT_PASSWORD_UPDATE_SUCCESS') {
            this._alertService.raiseAlert("Password changed successfully.");
            this._router.navigate(['myprofile', { outlets: { 'profileoutlet': ['profileinfo'] } }]);
          } else if (data.statusDesc == 'PASSWORD_NOT_MATCHED') {
            this._alertService.raiseAlert("Password not matched.");
          } else  {
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
