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

  public saveAddress(addressInfoJson?): Observable<any> {
    return this._httpCommonService.postRequest('user/contact', addressInfoJson, this._userService.getAuthToken());
  }

  public updateAddress(addressInfoJson?): Observable<any> {
    return this._httpCommonService.postRequest('user/contact', addressInfoJson, this._userService.getAuthToken());
  }

  public deleteAddress(addressId?): Observable<any> {
    let body = {
      "countryCode": "us",
      "addressid": addressId
    }
    return this._httpCommonService.deleteRequest('user/contact', body, this._userService.getAuthToken());
  }

  public address_validation_msg = {
    'mobile_number': [
      { type: 'required', message: 'Mobile number is required' },
      { type: 'pattern', message: 'Enter valid 10 digits mobile number' }
    ],
    'zipcode': [
      { type: 'required', message: 'Zipcode is required.' },
      { type: 'pattern', message: 'You must accept terms and conditions' }
    ],
    "address":[
      { type: 'required', message: 'Address is required.' },
      { type: 'pattern', message: 'Address must be 20 characters only.' }
    ]
    }

}
