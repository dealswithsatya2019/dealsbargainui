import { Injectable } from '@angular/core';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyordersService {

  constructor(private _httpCommonService: HttCommonService, public _router: Router, public _userService: UserService) { 

  }
 
  public getOrders(countryCode?): Observable<any> {
    return this._httpCommonService.postRequest('order/get-order/'+countryCode,'', this._userService.getAuthToken());
  }
}
