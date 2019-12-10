import { Injectable } from '@angular/core';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { Observable } from 'rxjs';
import { ProfileUpdateInfo } from 'src/app/models/ProfileUpdateInfo';

@Injectable({
  providedIn: 'root'
})
export class MyprofileService {

  constructor(private _httpCommonService: HttCommonService, public _router: Router, public _userService: UserService) {
  }

  public getUserProfile(countryCode?): Observable<any> {
    let body = {
      "countryCode": countryCode
    }
    return this._httpCommonService.postRequest('user/getuserprofile', body, this._userService.getAuthToken());
  }

  public updateUserProfile(updateProfileJson): Observable<any> {
    console.log(updateProfileJson);
    return this._httpCommonService.postRequest('user/updateUserProfile', updateProfileJson, this._userService.getAuthToken());
  }

  
}
