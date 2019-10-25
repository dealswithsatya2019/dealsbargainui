import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttCommonService {

  constructor(private http: HttpClient) { }

  Origin = window.location.origin;
  apiURL = this.getApiUrl();

  getApiUrl() {
    /* if (this.Origin.includes('localhost')) {
       if (environment.production && environment.remove_tomcat_dependency) {
         return environment.local_proxy;
       }
     } else {
    return `${this.Origin}`;
    }*/
    return "http://34.233.128.163/api/v1";

  }

  private extractData(res: Response) {
    const body = res;
    return body || [];
  }

  private handleError(error: Response) {
    console.log('inside handleerr/or', error);
    if (error) {
      return throwError(error);
    }
  }

  postReq(urlAppendParam, body?): Observable<any> {
    let url: string ="";
    if (urlAppendParam) {
      url = this.apiURL + '/' + urlAppendParam;
    } else {
      url = this.apiURL;
    }
    return this.http.post(
      url, body,
      { headers: { 'Content-Type': 'application/json' } }).pipe(map(this.extractData));
    //}).pipe(map(this.extractData).catch(this.handleError));
  }


}
