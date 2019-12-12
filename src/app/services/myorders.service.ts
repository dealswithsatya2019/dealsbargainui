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

  public cancelOrReturn(orderTrackId?, orderdetailsId?, category?, subcategory?, item_id?, master_supplier?, countryCode?, status?): Observable<any> {
    let body ={
      "order_tracking_id": orderTrackId,
      "category": category,
      "subcategory": subcategory,
      "item_id": item_id,
      "master_supplier": master_supplier,
      "order_details_id":orderdetailsId,
      "status":status
  }
    return this._httpCommonService.postRequest('order/cancel-order/'+countryCode,body, this._userService.getAuthToken());
  }
}
