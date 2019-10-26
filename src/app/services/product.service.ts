import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _httpCommonService: HttCommonService, public _router: Router) { }
  
  routeProductDetails(params) {
    this._router.navigate(['/productdetails', { cname: params.cname, scname: params.scname, pid: params.pid }]);
  }

  public getProductlist(categoryName, subCategoryName?, countryCode?, from?, limit?): Observable<any> {
    const body =
      {
        "countryCode": countryCode,
        "categoryName": categoryName,
        "subCategoryName": subCategoryName,
        "pageForm": from,
        "noOfResults": limit
      };
    return this._httpCommonService.postReq('products/' + categoryName, JSON.stringify(body));
  }

  /**
   * 
   * @param dealType f-flash deals, h-hot deals, t-today deals
   * @param countryCode 
   * @param from 
   * @param limit 
   */
  public getHttpProductDealsByType(dealType?, countryCode?, from?, limit?): Observable<any> {
    const body =
      {
        "countryCode": countryCode,
        "categoryName": "deals",
        "dealType": dealType,
        "pageForm": from, "noOfResults": limit
      };
    return this._httpCommonService.postReq('products/deals', JSON.stringify(body));
  }

  public getHttpProductDetailsById(cname?, scname?, pid?, countryCode?): Observable<any> {
    const body =
      {
        "countryCode": countryCode,
        "categoryName": cname,
        "subCategoryName": scname,
        "productId": pid
      }

    return this._httpCommonService.postReq('products/fetchproduct', JSON.stringify(body));
  }

}
