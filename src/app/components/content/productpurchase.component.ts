import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Product } from 'src/app/models/product';
import { LoginformService } from 'src/app/services/forms/loginform.service';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { ProductService } from 'src/app/services/product.service';
import { Observable } from 'rxjs';
import { addressResponse } from 'src/app/models/addressResponse';
import { UserService } from 'src/app/user.service';
import { AuthService as UserAuth } from 'src/app/services/auth.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import * as CryptoJS from 'crypto-js';
import { cartInfo } from 'src/app/models/cartInfo';
import { CartService } from 'src/app/services/cart.service';
import { AddProductReq } from './addproductreq';
import { environment } from 'src/environments/environment';
declare let paypal: any;

@Component({
  selector: 'app-productpurchase',
  templateUrl: './productpurchase.component.html',
  styleUrls: ['./productpurchase.component.scss']
})
export class ProductpurchaseComponent implements OnInit, AfterViewInit {
  public autherization: string;
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
  public loginErrorMsg: string;
  public addressInfo: addressResponse;
  public cartInfo: cartInfo;
  private APIEndpoint: string = environment.APIEndpoint;

  addressform: FormGroup = new FormGroup({
    countrycode: new FormControl('us'),
    name: new FormControl(''),
    mobile_number: new FormControl(''),
    zipcode: new FormControl(''),
    street: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    landmark: new FormControl(''),
    altphone: new FormControl(''),
  });

  constructor(public loginformService: LoginformService,
    public userservice: UserService,
    public _socioAuthServ: AuthService,
    public userAuth: UserAuth,
    public encryptionService: EncryptionService,
    private _Activatedroute: ActivatedRoute,
    public _productservice: ProductService,
    public _router: Router,
    public httpService: HttCommonService,
    public http: HttpClient,
    private cartService: CartService
  ) { }


  ngOnInit() {
    let access_token = sessionStorage.getItem("access_token");
    if (access_token != null) {
      this.autherization = "Bearer " + access_token;
      this.loginformService.response = JSON.parse(sessionStorage.getItem("f_login_form"));
      console.log("response ", this.loginformService.response);
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
                  value: this.totalPaybaleCost,
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

  ngAfterViewInit() {
    this.configurePaypal();
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

  funLogin() {
    let userInfo = JSON.parse(JSON.stringify(this.loginformService.form.value));
    var key1 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
    var key2 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));
    var key3 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(128 / 8));

    var ciphertext = this.encryptionService.encrypt(key2, key3, key1, userInfo.password);
    try {
      this.userAuth.authenticateUser(userInfo.name, userInfo.password, 'us', key1, key2, key3).subscribe(
        (authResponse: AuthResopnse) => {
          if (authResponse.statusCode === 200) {
            this.userservice.form.setValue({
              name: userInfo.name,
              email: null,
              password: null,
              mobileno: null
            });
            sessionStorage.setItem("f_login_form", JSON.stringify(this.userservice.form.value));
            this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
            this.loginformService.response = JSON.parse(JSON.stringify(this.loginformService.form.value));
            sessionStorage.setItem("access_token", authResponse.responseObjects.access_token);
            this.autherization = "Bearer " + authResponse.responseObjects.access_token;
            this.addCart();
          } else {
            this.loginErrorMsg = authResponse.statusDesc;
          }
        });
    } catch (error) {
      this.loginErrorMsg = 'Got issue check in console';
      console.log(error);
    }
    this._router.navigateByUrl("/productpurchase");
  }

  setStep(stepNo) {
    this.stepNo = stepNo;
    if (this.stepNo == 1) {
      this.exp1 = true;
      this.exp2 = this.exp3 = this.exp4 = this.exp5 = false;
    } else if (this.stepNo == 2) {
      this.exp2 = true;
      this.exp1 = this.exp3 = this.exp4 = this.exp5 = false;
      this.getAddresses();
    } else if (this.stepNo == 3) {
      this.exp3 = true;
      this.exp2 = this.exp1 = this.exp4 = this.exp5 = false;
      this.getCarts();
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
    this.autherization = null;
    this.cartInfo = null;
    this.addressInfo = null;
    sessionStorage.removeItem("f_login_form");
    sessionStorage.removeItem("access_token");
  }

  funSave() {
    let addressInfo = JSON.parse(JSON.stringify(this.addressform.value));
    console.log("addressInfo :", addressInfo);
    this.saveAddress(addressInfo);
  }

  public getAddresslist(): Observable<addressResponse> {
    return this.http.get<addressResponse>(this.APIEndpoint + "/user/contacts/us",
      { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
  }

  public getCartlist(): Observable<cartInfo> {
    return this.http.post<cartInfo>(this.APIEndpoint + "/user/cart/operation/getCartInfo",
      { "countryCode": "us" }, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
  }

  public getCarts() {
    this.getCartlist().subscribe(data => {
      this.cartInfo = data;
      this.calculatePrices();
    });
  }

  public getAddresses() {
    this.getAddresslist().subscribe(data => 
      {
        this.addressInfo = data;
        console.log("staus code ",this.addressInfo.statusCode);
        if(this.addressInfo.statusCode ==  404){
          this.exp3 = true;
        }
      });
  }

  public showAddressInfo(addressId) {
    console.log("address Id :", addressId);
  }

  public saveAddress(addressInfoJson: string) {
    this.http.post(this.APIEndpoint + "/user/contact", addressInfoJson,
      { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } }).subscribe(data => {
        console.log("Address :", data);
        let jsonobj = JSON.parse(JSON.stringify(data));
        console.log("Status", jsonobj.statusCode);
        if (jsonobj.statusCode == 200 || 1 == 1) {
          this.getAddresses();
          this.setStep(2);
        }
      })
  }

  public addProductsArray: AddProductReq[] = [];
  public productReq: AddProductReq;
  public addProduToCart(): Observable<any> {
    this.cartService.getItems().forEach(element => {
      this.productReq = new AddProductReq();
      this.productReq.category = element.category;
      this.productReq.countryCode = "us";
      this.productReq.count = element.quantity + "";
      this.productReq.item_id = element.item_id;
      this.productReq.master_supplier = element.master_suplier;
      this.productReq.subcategory = element.subcategory;
      this.addProductsArray.push(this.productReq);
    });
    let body = JSON.stringify(this.addProductsArray);
    console.log("BODY", body);
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/addItemToCart",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
  }
  public addCartData: any;

  public addCart() {
    this.addProduToCart().subscribe(data => this.addCartData = data);
  }

  public totalCost: number = 0;
  public deliveryCost: number = 0;
  public couponDiscountCost: number = 0;
  public totalPaybaleCost: number = 1;
  public totalCartSize: number = 0;

  public calculatePrices() {
    this.initializeValues();
    this.cartInfo.responseObject.forEach(element => {
      this.totalCost = this.totalCost + element.prepay_price;
      this.deliveryCost = element.ship_cost;
      this.couponDiscountCost = 0;
    });
    this.totalPaybaleCost = ((this.totalCost + this.deliveryCost) - this.couponDiscountCost)
    this.totalCartSize = this.cartInfo.responseObject.length;
    console.log(this.totalCost + ":" + this.deliveryCost + ":" + this.couponDiscountCost + ":" + this.totalPaybaleCost + ":" + this.totalCartSize);
  }

  public initializeValues() {
    this.totalCost = 0;
    this.deliveryCost = 0;
    this.couponDiscountCost = 0;
    this.totalPaybaleCost = 0;
    this.totalCartSize = 0;
  }

  public removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);

  }

  public removeProduct(product: Product) {
    this.cartService.removeCart(product);
  }

  public selectedIndex: number = 0;
  public selectionChange(event) {
    if (event.selectedIndex == 0) {
    } else if (event.selectedIndex == 1) {
      this.getAddresses();
    } else if (event.selectedIndex == 2) {
      this.getCarts();
    } else if (event.selectedIndex == 3) {

    }
    return false;
  }

  public configurePaypal() {
    
  }

  public addCartFromSummary(product: Product) {
    this.addProduToCartFromSummary(product).subscribe(data => this.addCartData = data);
  }

  public addProduToCartFromSummary(product: Product): Observable<any> {
    let body = [
      {
        "countryCode": "us",
        "category": product.category,
        "subcategory": product.subcategory,
        "item_id": product.item_id,
        "master_supplier": product.master_suplier,
        "count": "1"
      },
    ]
    this.cartService.addToCart(product);
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/addItemToCart",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
      
  }



}
