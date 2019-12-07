import { Injectable } from '@angular/core';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/user.service';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  constructor(private _httpCommonService: HttCommonService, public _router: Router, public _userService: UserService) { 

  }
 
  public getAddressList(countryCode?): Observable<any> {
    return this._httpCommonService.getRequest('user/contacts/us', this._userService.getAuthToken());
  }
}
