import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
import { environment } from 'src/environments/environment';
import { IMaps } from '../models/IMaps';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttCommonService {

  private APIEndpoint: string = environment.APIEndpoint;

  constructor(private http: HttpClient,public router: Router) { }

  Origin = window.location.origin;
  apiURL = this.getApiUrl();

  getApiUrl() {
    return this.APIEndpoint;
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

  private handlePostError(error: Response) {
    console.log('inside handleerr/or', error);
    if(error instanceof HttpErrorResponse){
      let json =error.error;
      if(json.error == 'invalid_token'){
        sessionStorage.removeItem("sn");
        setTimeout(() => {
          this.routetoLoginpage();  
       });
      }else{
        return throwError(error);
      }
    }else{
      return throwError(error);
    }
  }

  private routetoLoginpage(){
    this.router.navigateByUrl('/login');
  }


  getReq(urlAppendParam): Observable<any> {
    let url: string = "";
    if (urlAppendParam) {
      url = this.apiURL + '/' + urlAppendParam;
    } else {
      url = this.apiURL;
    }
    return this.http.get(
      url,
      { headers: { 'Content-Type': 'application/json' } }).pipe(map(this.extractData), catchError(this.handleError));
  }

  getRequest(urlAppendParam, authToken?): Observable<any> {
    let url: string = "";
    if (urlAppendParam) {
      url = this.apiURL + '/' + urlAppendParam;
    } else {
      url = this.apiURL;
    }
    return this.http.get(
      url,
      { headers: { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + authToken } })
      .pipe(
        map(this.extractData), 
        catchError(error=> 
          {
            console.log('inside handleerr/or', error);
            return throwError(error);
          }));
  }


  postReq(urlAppendParam, body?): Observable<any> {
    let url: string = "";
    if (urlAppendParam) {
      url = this.apiURL + '/' + urlAppendParam;
    } else {
      url = this.apiURL;
    }
    return this.http.post(
      url, body,
      { headers: { 'Content-Type': 'application/json' } }).pipe(map(this.extractData), catchError(this.handleError));
  }

  postSocialReq(body): Observable<any> {
    return this.http.post(
      this.APIEndpoint + "/socail/us", body,
      { headers: { 'Content-Type': 'application/json' } }).pipe(map(this.extractData), catchError(this.handleError));
  }

  postRequest(urlAppendParam, body?, authToken?): Observable<any> {
    let url: string = "";
    if (urlAppendParam) {
      url = this.apiURL + '/' + urlAppendParam;
    } else {
      url = this.apiURL;
    }
    return this.http.post(
      url, body,
      { headers: { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + authToken } }).pipe(map(this.extractData), catchError(this.handleError));
  }

  deleteRequest(urlAppendParam, body?, authToken?): Observable<any> {
    let url: string = "";
    if (urlAppendParam) {
      url = this.apiURL + '/' + urlAppendParam;
    } else {
      url = this.apiURL;
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': 'Bearer ' + authToken }), body
    };
    return this.http.delete(url, httpOptions).pipe(map(this.extractData), catchError(this.handleError));
  }

  getMapsServiceImaps(): Observable<IMaps> {
    return this.http.get<IMaps>("https://api.ipapi.com/api/check?access_key=" + environment.IPAPIKEY);
  }


}
