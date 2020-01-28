import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpParams, HttpErrorResponse } from '@angular/common/http';

//import 'rxjs/add/operator/do';
//import 'rxjs/add/operator/catch';
import { DatePipe } from '@angular/common';



import { tap, filter, take, finalize } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
      null
  );
  constructor(public auth: AuthService,
    public _userSerive: UserService,
    public _router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request
    /*)
      .pipe(
        catchError((error, caught: Observable<HttpEvent<any>>) => {
          if (error instanceof HttpErrorResponse && error.status == 401) {
              let json =error.error;
              if(json.error == 'invalid_token'){
                sessionStorage.removeItem("sn");
                this._router.navigateByUrl('/login');
                return error1;
              }else{
                return error;
              }
            throw error;
          }
        })
      //}*/
     ).pipe(
       //tap(data => console.log(data)),
      catchError((error: any) =>  {       
        if (request.url.includes("fetchapi/us") || request.url.includes("authenticate")) {
          // We do another check to see if refresh token failed
          // In this case we want to logout user and to redirect it to login page
          if (request.url.includes("refreshtoken")) {
              this.auth.logOut();
          }
          return Observable.throw(error);
        }
        // If error status is different than 401 we want to skip refresh token
        // So we check that and throw the error if it's the case
        if (error.status !== 401) {
            return Observable.throw(error);
        }
        if (error instanceof HttpErrorResponse && error.status == 401) {
          if(error.error && error.error.error == 'invalid_token'){
            sessionStorage.removeItem("sn");
            this.auth.logOut();
            this._router.navigateByUrl('/login');
            window.location.reload();
            return throwError(error);
          }else{
            return throwError(error);
          }
        }else{
          return Observable.throw(error);
        }
        if (this.refreshTokenInProgress) {
          // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
          // – which means the new token is ready and we can retry the request again
          return this.refreshTokenSubject.pipe(
              filter(result => result !== null)
              , take(1)
              , switchMap(() => next.handle(this.addAuthenticationToken(request)))
            ,// When the call to refreshToken completes we reset the refreshTokenInProgress to false
              // for the next time the token needs to be refreshed
              finalize(() => (this.refreshTokenInProgress = false))
          );
        } else {
          this.refreshTokenInProgress = true;
          // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
          this.refreshTokenSubject.next(null);
          // Call auth.refreshAccessToken(this is an Observable that will be returned)
          return this.auth
              .refreshAccessToken().
              switchMap((token: any) => {
                  //When the call to refreshToken completes we reset the refreshTokenInProgress to false
                  // for the next time the token needs to be refreshed
                  this.refreshTokenInProgress = false;
                  this.refreshTokenSubject.next(token);
                  return next.handle(this.addAuthenticationToken(request));
              }).catchError((err: any) => {
                  this.refreshTokenInProgress = false;
                  this.auth.logOut();
                  return Observable.throw(error);
              });
          }  
      })
    )as Observable<HttpEvent<any>>;;
  
  }


  addAuthenticationToken(request: HttpRequest<any>) : HttpRequest<any> {
    // Get access token from Local Storage
    const accessToken = this._userSerive.getAuthToken();
      // If access token is null this means that user is not logged in
        // And we return the original request
      
    if (!accessToken) {
      return request;
    }
    // We clone the request, because the original request is immutable
    return request.clone(
      //{setHeaders: {Authorization: this._userSerive.getAuthToken()}}
      //{ headers: request.headers.set('Accept', 'application/json') }
    );
  }
}