import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Product } from 'src/app/models/product';
import { LoginformService } from 'src/app/services/forms/loginform.service';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { ProductService } from 'src/app/services/product.service';
import { searchreponse } from 'src/app/models/searchResponse';
import { Observable } from 'rxjs';
import { addressResponse } from 'src/app/models/addressResponse';
declare let paypal: any;
@Component({
  selector: 'app-productpurchase',
  templateUrl: './productpurchase.component.html',
  styleUrls: ['./productpurchase.component.scss']
})
export class ProductpurchaseComponent implements OnInit {

  @ViewChild('paypal', { static: true })
  paypalElement: ElementRef;
  paypalFor: boolean = false;
  stepNo: number = 1;
  exp1: boolean = true;
  exp2: boolean = false;
  exp3: boolean = false;
  exp4: boolean = false;
  exp5: boolean = false;
  userName: string = "";
  public productDetails: any[];
  public product: Product;
  public cname: string;
  public scname: string;
  public pid: string;
  addressform: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    mobile_number: new FormControl('', [Validators.required]),
    zipcode: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    landmark: new FormControl('', [Validators.required]),
    altphone: new FormControl('', [Validators.required]),
    countrycode: new FormControl('us'),

  });

  constructor(public loginformService: LoginformService, public _socioAuthServ: AuthService, private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public httpService: HttCommonService, public http: HttpClient) { }

  ngOnInit() {
  
    this.setStep(1);
    let sessioninfo = sessionStorage.getItem("f_login_form");
    this.loginformService.response = sessioninfo;
    if (sessioninfo != null) {
      this.setStep(2);
    }

    paypal
      .Buttons({
        style: {
          layout: 'horizontal'
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: "",
                amount: {
                  currency_code: "USD",
                  value: "0.01",
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          this.paypalFor = true;
          console.log("order :", order);
        },
        onError: err => {
          console.log("Error :", err);
        }

      })
      .render(this.paypalElement.nativeElement);

  }

  loginFacebook() {
    this._socioAuthServ.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.loginformService.response = response;
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
        this.userName = response.name;
        this.setStep(2);
        this.exp1 = false;
        this.exp2 = true;
      }
    );
  }

  loginGmail() {
    this._socioAuthServ.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.loginformService.response = response;
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
        this.userName = response.name;
        this.setStep(2);
        this.exp1 = false;
        this.exp2 = true;
      }
    );
  }

  setStep(stepNo) {
    this.stepNo = stepNo;
    if (this.stepNo == 1) {
      this.exp1 = true;
      this.exp2 = this.exp3 = this.exp4 = this.exp5 = false;
    } else if (this.stepNo == 2) {
      this.exp2 = true;
      this.exp1 = this.exp3 = this.exp4 = this.exp5 = false;
    } else if (this.stepNo == 3) {
      this.exp3 = true;
      this.exp2 = this.exp1 = this.exp4 = this.exp5 = false;
    } else if (this.stepNo == 4) {
      this.exp4 = true;
      this.exp2 = this.exp3 = this.exp1 = this.exp5 = false;
    } else if (this.stepNo == 5) {
      this.exp5 = true;
      this.exp2 = this.exp3 = this.exp4 = this.exp1 = false;
    }
  }

  signOut(): void {
    this._socioAuthServ.signOut();
    this.loginformService.response = null;
    sessionStorage.removeItem("f_login_form");
    this.setStep(1);
  }

  funSave() {
    let addressInfo = JSON.parse(JSON.stringify(this.addressform.value));
    console.log("addressInfo :", addressInfo);
    this.saveAddress(addressInfo);

  }

  public getAddresslist(): Observable<addressResponse> {
    let autherization: string = "Bearer 81c319a4-bcf1-4f19-9bba-2d311d8c293f";
    return this.http.get<addressResponse>("http://34.233.128.163/api/v1/user/contacts/us",
      { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  }

  public addressInfo: addressResponse;

  public getAddresses() {
    this.getAddresslist().subscribe(data => this.addressInfo = data);
  }

  public showAddressInfo(addressId) {
    console.log("address Id :", addressId);
  }


  public saveAddress(addressInfoJson: string) {
    let autherization: string = "Bearer 81c319a4-bcf1-4f19-9bba-2d311d8c293f";
    this.http.post("http://34.233.128.163/api/v1/user/contact", addressInfoJson,
      { headers: { 'Content-Type': 'application/json', 'authorization': autherization } }).subscribe(data => {
        console.log("Address :", data);
        let jsonobj = JSON.parse(JSON.stringify(data));
        console.log("Status", jsonobj.statusCode);
        if (jsonobj.statusCode == 200 || 1 == 1) {
          this.getAddresses();
          this.setStep(2);
        }
      })
  }

}
