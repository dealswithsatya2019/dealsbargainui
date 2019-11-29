import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
import { environment } from 'src/environments/environment';
import { IMaps } from '../models/IMaps';

@Injectable({
  providedIn: 'root'
})
export class HttCommonService {

  private APIEndpoint : string  = environment.APIEndpoint;

  constructor(private http: HttpClient) { }

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

  postReq(urlAppendParam, body?): Observable<any> {
    let url: string ="";
    if (urlAppendParam) {
      url = this.apiURL + '/' + urlAppendParam;
    } else {
      url = this.apiURL;
    }
    return this.http.post(
      url, body,
      { headers: { 'Content-Type': 'application/json' } }).pipe(map(this.extractData),catchError(this.handleError));
  }

  postRequest(urlAppendParam, body?, authToken?): Observable<any> {
    let url: string ="";
    if (urlAppendParam) {
      url = this.apiURL + '/' + urlAppendParam;
    } else {
      url = this.apiURL;
    }
    return this.http.post(
      url, body,
      { headers: { 'Content-Type': 'application/json','authorization': 'Bearer '+authToken} }).pipe(map(this.extractData),catchError(this.handleError));
  }

  getMapsServiceImaps() : Observable<IMaps>{
    return this.http.get<IMaps>("https://ipapi.co/json");
  }


}
