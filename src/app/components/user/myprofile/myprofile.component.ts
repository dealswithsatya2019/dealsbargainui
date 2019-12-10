import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MyprofileService } from 'src/app/services/myprofile.service';
import { searchreponse } from 'src/app/models/searchResponse';
import { ProfileInfo } from 'src/app/models/ProfileInfo';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileUpdateInfo } from 'src/app/models/ProfileUpdateInfo';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit, OnDestroy {

  constructor(public _profileInfoService: MyprofileService, public _alertService: AlertService) { }

  subscriptions: Subscription = new Subscription();
  //https://stackoverflow.com/questions/51584265/angular-6-date-format-mm-dd-yyyy-in-reactive-form
  profileform: FormGroup = new FormGroup({
    countryCode: new FormControl('us'),
    action: new FormControl('updateprofile'),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    dob: new FormControl(''),
    email: new FormControl(''),
    mobile: new FormControl('' )
  });

  ngOnInit() {
    this.getUserProfile();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  public getUserProfile() {
    this.subscriptions.add(this._profileInfoService.getUserProfile('us').subscribe(
      (data) => {
        if (data.statusDesc == 'USER_FOUND') {
          if(data.responseObject && data.responseObject.length >0){
            this.setProfileFormValues(data.responseObject[0]);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    ));
  }

  public setProfileFormValues(profileInfo: ProfileInfo) {
    this.profileform.controls.firstname.setValue(profileInfo.first_name);
    this.profileform.get('firstname').setValidators([Validators.required, Validators.maxLength(25)]);
    this.profileform.controls.lastname.setValue(profileInfo.last_name);
    this.profileform.get('lastname').setValidators([Validators.required, Validators.maxLength(25)]);
    this.profileform.controls.mobile.setValue(profileInfo.mobile);
    this.profileform.get('mobile').setValidators([Validators.required, Validators.pattern('[0-9]{10}')]);
    this.profileform.controls.email.setValue(profileInfo.email);
    this.profileform.get('email').setValidators([Validators.required,  Validators.required, Validators.email]);
  }
  public updateUserProfile() {
    let userInfo = JSON.parse(JSON.stringify(this.profileform.value));
    this.subscriptions.add(this._profileInfoService.updateUserProfile(userInfo).subscribe(
      (data) => {
        if (data.statusDesc == 'UPDATE_SUCCESS') {
          this._alertService.raiseAlert("Pofile updated Successfully.");
        }else{
          console.log(data);
          this._alertService.raiseAlert("Failed to update profile.");
        }
      },
      (error) => {
        console.log(error);
        this._alertService.raiseAlert("Failed to update profile.");
      }
    ));
  }
}
