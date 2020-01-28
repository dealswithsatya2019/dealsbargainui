import { Component, OnInit } from '@angular/core';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatDialogConfig } from '@angular/material';
import { MatDialog } from '@angular/material';
import { SignupComponent } from 'src/app/components/header/signup/signup.component';
import { ForgotpasswordComponent } from 'src/app/components/header/forgotpassword/forgotpassword.component'
import * as CryptoJS from 'crypto-js';
import { EncryptionService } from 'src/app/services/encryption.service';
import { AuthService as UserAuth } from 'src/app/services/auth.service';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import { LoginformService } from 'src/app/services/forms/loginform.service';
import { WhishlistService } from 'src/app/services/whishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyprofileService } from 'src/app/services/myprofile.service';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { cartInfo } from 'src/app/models/cartInfo';
import { catchError } from 'rxjs/internal/operators/catchError';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginErrorMsg: string;
  subscriptions = new Subscription();
  constructor(public dialog: MatDialog,
    public userservice: UserService,
    public loginformService: LoginformService,
    public _socioAuthServ: AuthService,
    public userAuth: UserAuth,
    public cartService: CartService,
    public router: Router,
    public encryptionService: EncryptionService,
    public whishlistService: WhishlistService,
    private _snackBar: MatSnackBar,
    public _userSerive: UserService,
    public _profileInfoService: MyprofileService
  ) { }

  ngOnInit() {
    this.loginformService.resetForm();
    // this._snackBar.open(message, action, {
    //   duration: 2000,
    // });
  }


  loginFacebook() {
    this._socioAuthServ.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (response) => {
        console.log("Facebook Provider ",response);
        this.setSocialInfo(response);
      }
    );
  }

  setSocialInfo(response) {
    let json = {
      "id": response.id,
      "name": response.name,
      "email": response.email,
      "image_url": response.photoUrl,
      "firstName": response.firstName,
      "lastName": response.lastName,
      "provider": response.provider,
      "mobile": ""
    };
    this.userAuth.authenticateSocialUser(json).subscribe(authResponse => {
      if (authResponse.statusCode === 200) {
        this.userservice.form.controls['name'].setValue(response.name);
        sessionStorage.setItem("sn", authResponse.responseObjects.sn);
        this._userSerive.setAuthToken(authResponse.responseObjects.sn);
        this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
        this.loginformService.response = JSON.parse(JSON.stringify(this.loginformService.form.value));
        this._profileInfoService.funSetUserProfile();
        this.whishlistService.updateWhishlist();
        this.getCarts();
        if(this._userSerive.getQuickByNavigateFlag()){
          this.router.navigateByUrl('/productpurchase');
          // this._userSerive.setQuickByNavigateFlag(false);
        }else if(this._userSerive.getCheckoutNavigateFlag()){
          this.router.navigateByUrl('/mycart');
          // this._userSerive.setCheckoutNavigateFlag(false);
        }else{
          this.router.navigateByUrl('/home');  
        }
      } else {
        this.loginErrorMsg = authResponse.statusDesc;
        console.log('Failed' + JSON.stringify(authResponse));
      }
    });
  }

  loginGmail() {
    this._socioAuthServ.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        console.log("Gmail Provider ",response);
        this.setSocialInfo(response);
      },
      (error) =>{
        console.log(error);
      }
    );
  }

  forgotpwd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '430px';
    dialogConfig.height = '475px';
    this.dialog.open(ForgotpasswordComponent, dialogConfig);
  }
  funLogin() {
    let userInfo = JSON.parse(JSON.stringify(this.loginformService.form.value));
    var key1 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
    var key2 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
    var key3 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));

    var ciphertext = this.encryptionService.encrypt(key2, key3, key1, userInfo.password);
    this.userAuth.authenticateUser(userInfo.name, userInfo.password, 'us', key1, key2, key3).subscribe(
      (authResponse: AuthResopnse) => {
        if (authResponse.statusCode === 200 && authResponse.statusDesc ) {
          this.userservice.form.controls['name'].setValue(userInfo.name);
          console.log('Success' + JSON.stringify(authResponse));
          sessionStorage.setItem("sn", authResponse.responseObjects.sn);
          this._userSerive.setAuthToken(authResponse.responseObjects.sn);
          this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
          this.loginformService.response = JSON.parse(JSON.stringify(this.loginformService.form.value));
          this.getCarts();
          this._profileInfoService.funSetUserProfile();
          this.whishlistService.updateWhishlist();
          if(this._userSerive.getQuickByNavigateFlag()){
            this.router.navigateByUrl('/productpurchase');
            this._userSerive.setQuickByNavigateFlag(false);
          }else if(this._userSerive.getCheckoutNavigateFlag()){
            this.router.navigateByUrl('/mycart');
            this._userSerive.setCheckoutNavigateFlag(false);
          }else{
            this.router.navigateByUrl('/home');  
          }
  
        } else {
          this.loginErrorMsg = authResponse.statusDesc? authResponse.statusDesc: 'Invalid credentials.';
          console.log('Failed' + JSON.stringify(authResponse));
        }
      },
      (error: HttpErrorResponse) => {
        this.loginErrorMsg = error.error.statusDesc;
      }
    );
  }

  public cartInfo: cartInfo;
  public getCarts() {
    this.cartService.getCartlist().subscribe(data => {
      this.cartInfo = data;
      if (this.cartInfo != null && this.cartInfo.responseObject != null) {
        this.cartInfo.responseObject.forEach(element => {
          this.cartService.setItems(element);
        });
      }
    }
    );
  }

}
