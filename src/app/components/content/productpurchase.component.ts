import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Product } from 'src/app/models/product';
import { LoginformService } from 'src/app/services/forms/loginform.service';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { ProductService } from 'src/app/services/product.service';
import { Observable, Subscription } from 'rxjs';
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
import { address } from 'src/app/models/address';
import { delay } from 'q';
import { CreateOrederReq } from './orderReq';
import { PromoResponse } from './promoResponse';
import { PromoResponseMode } from './promoResponseModel';
declare let paypal: any;

@Component({
  selector: 'app-productpurchase',
  templateUrl: './productpurchase.component.html',
  styleUrls: ['./productpurchase.component.scss']
})
export class ProductpurchaseComponent implements OnInit {
  //public autherization: string;
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  paypalFor: boolean = false;
  exp1: boolean = true;
  exp2: boolean = false;
  userName: string = "";
  public productDetails: any[];
  public product: Product;
  public cname: string;
  public scname: string;
  public pid: string;
  public loginErrorMsg: string;
  public addressInfo: addressResponse;
  public address: address;
  public cartInfo: cartInfo;
  private APIEndpoint: string = environment.APIEndpoint;
  public selectedAddressId: string;
  public isLogIn: boolean = false;
  public isCart: boolean = false;
  public statesArr: string[] = environment.STATES.split(',');
  public shoppingCartItems: Product[] = [];
  subscriptions = new Subscription();
  send_date = new Date();
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;

  private deliverydate_configurable_days = environment.DeliveryDate_Configurable_days;


  addressform: FormGroup = new FormGroup({
    countrycode: new FormControl('us'),
    fullname: new FormControl('', [Validators.required]),
    mobile_number: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    zipcode: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    street: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    landmark: new FormControl(''),
    altphone: new FormControl(''),
    address_type: new FormControl('', [Validators.required]),
    country: new FormControl('United States', [Validators.required]),

  });

  updateaddressform: FormGroup = new FormGroup({
    countrycode: new FormControl('us'),
    fullname: new FormControl('', [Validators.required]),
    mobile_number: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    zipcode: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    street: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    landmark: new FormControl(''),
    altphone: new FormControl(''),
    address_id: new FormControl(''),
    country: new FormControl('United States', [Validators.required]),
    address_type: new FormControl('', [Validators.required]),
  });

  couponform: FormGroup = new FormGroup({
    couponcode: new FormControl('', [Validators.required]),
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
    private cartService: CartService) {
    this.send_date.setHours(this.send_date.getHours() + (this.deliverydate_configurable_days * 24));
  }


  ngOnInit() {
    //let access_token = sessionStorage.getItem("access_token");
    if (this.userservice.getAuthToken() != null) {
      //this.autherization = "Bearer " + access_token;
      this.loginformService.response = JSON.parse(sessionStorage.getItem("f_login_form"));
      this.isLogIn = true;
    }
    this.shoppingCartItems = this.cartService.getItems();
    this.initializeValues();
    this.calculatePrices();

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
                  value: 0.01,
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          this.paypalFor = true;
          let orderJson = JSON.parse(JSON.stringify(order));
          let orderId = orderJson.id;
          let create_time = orderJson.create_time;
          let update_time = orderJson.update_time;
          let dispute_categories = orderJson.dispute_categories;
          let status = orderJson.status;
          this.createOrder();
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
      this.subscriptions.add(this.userAuth.authenticateUser(userInfo.name, userInfo.password, 'us', key1, key2, key3).subscribe(
        (authResponse: AuthResopnse) => {
          if (authResponse.statusCode === 200) {
            this.userservice.form.setValue({
              name: userInfo.name,
              email: null,
              password: null,
              mobileno: null,
              aggreecbx: false
            });
            this.isLogIn = true;
            sessionStorage.setItem("f_login_form", JSON.stringify(this.userservice.form.value));
            this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
            this.loginformService.response = JSON.parse(JSON.stringify(this.loginformService.form.value));
            sessionStorage.setItem("access_token", authResponse.responseObjects.access_token);
            this.addCart();
          } else {
            this.loginErrorMsg = authResponse.statusDesc;
          }
        }));
    } catch (error) {
      this.loginErrorMsg = 'Got issue check in console';
      console.log(error);
    }
    this._router.navigateByUrl("/productpurchase");
  }

  signOut(): void {
    this._socioAuthServ.signOut();
    this.loginformService.response = null;
    this.userservice.setAuthToken(null);
    this.cartInfo = null;
    this.addressInfo = null;
    this.cartService.setItems(null);
    this.shoppingCartItems = null;
    sessionStorage.removeItem("f_login_form");
    sessionStorage.removeItem("access_token");
    this._router.navigateByUrl("/");
  }

  funSave() {
    let addressInfo = JSON.parse(JSON.stringify(this.addressform.value));
    console.log("addressInfo :", addressInfo);
    this.saveAddress(addressInfo);
  }

  public isUpdateAddress: boolean;

  public getAddresslist(): Observable<addressResponse> {
    let autherization = "Bearer " + this.userservice.getAuthToken();
    return this.http.get<addressResponse>(this.APIEndpoint + "/user/contacts/us",
      { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  }

  public updateAddress(addressInfoJson): Observable<addressResponse> {
    let autherization = "Bearer " + this.userservice.getAuthToken();
    return this.http.post<addressResponse>(this.APIEndpoint + "/user/contact/", addressInfoJson,
      { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  }

  public deleteAddress(addressId: string): Observable<addressResponse> {
    let body = {
      "countryCode": "us",
      "addressid": addressId
    }
    let autherization = "Bearer " + this.userservice.getAuthToken();
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': autherization }), body
    };
    this.exp1 = true;
    this.exp2 = false;
    this.isUpdateAddress = false;
    this.selectedAddressId = null;
    return this.http.delete<addressResponse>(this.APIEndpoint + "/user/contact", httpOptions);
  }

  public updateAddressService(addressId: string) {
    console.log("address id", addressId);
    this.updateaddressform.controls.address_id.setValue(addressId);
    let addressInfo = JSON.parse(JSON.stringify(this.updateaddressform.value));
    console.log("addressInfo update :", addressInfo);
    this.subscriptions.add(this.updateAddress(addressInfo).subscribe(data => {
      this.addressInfo = data;
      if (this.addressInfo.statusCode == 201) {
        this.getAddresses();
        this.cartService.raiseAlert("The selected address has been updated successfully.");
      } else {
        this.cartService.raiseAlert("The selected address update has been failed. Please provide proper information");
      }
    }));
    this.isUpdateAddress = false;
    this.exp1 = false;
    this.exp2 = false;

  }

  public deleteAddressService(addressId: string) {
    this.subscriptions.add(this.deleteAddress(addressId).subscribe(data => {
      this.addressInfo = data;
      if (this.addressInfo.statusCode == 200) {
        this.cartService.raiseAlert("The selected address has been deleted successfully.");
        this.getAddresses();
      } else {
        this.cartService.raiseAlert("Failed to create the address. Please send a mail");
      }
    }));
  }

  public getCartlist(): Observable<cartInfo> {
    let autherization = "Bearer " + this.userservice.getAuthToken();
    if (this.selectedAddressId != null && this.selectedAddressId.length > 0) {
      let body = {
        "countryCode": "us",
        "address_id": this.selectedAddressId,
      }
      return this.http.post<cartInfo>(this.APIEndpoint + "/user/cart/operation/getCartInfo",
        body, { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
    } else {
      return this.http.post<cartInfo>(this.APIEndpoint + "/user/cart/operation/getCartdetails/us",
        { "countryCode": "us" }, { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
    }
  }

  public getCarts() {
    this.subscriptions.add(this.getCartlist().subscribe(data => {
      this.cartInfo = data;
      this.shoppingCartItems = [];
      if (this.cartInfo != null && this.cartInfo.responseObject != null) {
        this.isCart = true;
        this.cartService.clearCart();
        this.cartInfo.responseObject.forEach(element => {
          if (element.quantity == 0) {
            element.quantity = 1;
          }
          this.cartService.setItems(element);
          this.shoppingCartItems.push(element);
        });
        console.log("shoppingCartItems ", this.shoppingCartItems);
        this.initializeValues();
        this.calculatePrices();
      }
    }));
  }

  public getAddresses() {
    this.subscriptions.add(this.getAddresslist().subscribe(data => {
      this.addressInfo = data;
      this.selectedAddressId = null;
      if (this.addressInfo.statusCode == 404) {
        this.exp1 = true;
        this.exp2 = false;
      } else {
        this.exp1 = false;
        this.exp2 = false;
        this.isUpdateAddress = false;
      }
    }));
  }

  public showAddressInfo(addressId) {
    this.isUpdateAddress = true;
    this.exp1 = false;
    this.exp2 = true;
    this.address = (this.addressInfo.responseObjects.filter(itemLoop => itemLoop.address_id == addressId))[0];
    this.updateaddressform.controls.fullname.setValue(this.address.fullname);
    this.updateaddressform.controls.mobile_number.setValue(this.address.mobile_number);
    this.updateaddressform.controls.altphone.setValue(this.address.altphone);
    this.updateaddressform.controls.address.setValue(this.address.address);
    this.updateaddressform.controls.city.setValue(this.address.city);
    this.updateaddressform.controls.country.setValue(this.address.country);
    this.updateaddressform.controls.state.setValue(this.address.state);
    this.updateaddressform.controls.zipcode.setValue(this.address.zipcode);
    this.updateaddressform.controls.address_type.setValue(this.address.address_type);
    this.updateaddressform.controls.landmark.setValue(this.address.landmark);
    this.updateaddressform.controls.address_id.setValue(this.address.address_id);
  }

  public saveAddress(addressInfoJson: string) {
    let autherization = "Bearer " + this.userservice.getAuthToken();
    this.subscriptions.add(this.http.post(this.APIEndpoint + "/user/contact", addressInfoJson,
      { headers: { 'Content-Type': 'application/json', 'authorization': autherization } }).subscribe(data => {
        let jsonobj = JSON.parse(JSON.stringify(data));
        if (jsonobj.statusCode == 200) {
          this.cartService.raiseAlert("The address has been saved successfully.");
          this.getAddresses();
          this.exp1 = false;
          this.exp1 = false;
        } else {
          this.cartService.raiseAlert("Failed to creat the address, Please send a mail.");
        }
      }));

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
    let autherization = "Bearer " + this.userservice.getAuthToken();
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/addItemToCart",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  }

  public addCartData: any;

  public addCart() {
    this.subscriptions.add(this.addProduToCart().subscribe(data => {
      this.addCartData = data;
      this.getCarts();
    }));

  }

  public addOrdersArray: CreateOrederReq[] = [];
  public createOrderReq: CreateOrederReq;

  public createOrderData: any;

  public createOrderHttp(): Observable<any> {
    this.shoppingCartItems.forEach(element => {
      this.createOrderReq = new CreateOrederReq();
      this.createOrderReq.category = element.category;
      this.createOrderReq.item_id = element.item_id;
      this.createOrderReq.master_supplier = element.master_suplier;
      this.createOrderReq.subcategory = element.subcategory;
      this.createOrderReq.address_id = this.selectedAddressId;
      this.addOrdersArray.push(this.createOrderReq);
    });
    let body = JSON.stringify(this.addOrdersArray);
    let autherization = "Bearer " + this.userservice.getAuthToken();
    return this.http.post<any>(this.APIEndpoint + "/order/create-order",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  }

  public createOrder() {
    this.subscriptions.add(this.createOrderHttp().subscribe(data => this.createOrderData = data));
  }

  public totalCost: number = 0;
  public deliveryCost: number = 0;
  public couponDiscountCost: number = 0;
  public totalPaybaleCost: number = 1;
  public totalCartSize: number = 0;

  public calculatePrices() {
    console.log("calculatePrices", this.shoppingCartItems.length);
    this.shoppingCartItems.forEach(element => {
      if (element.dealtype != '') {
        this.totalCost = this.totalCost + element.deals_bargain_deal_price;
      } else if (element.dealtype == '' && element.discount == '0') {
        this.totalCost = this.totalCost + element.price;
      } else if (element.dealtype == '' && element.discount != '0') {
        this.totalCost = this.totalCost + element.discount_amount;
      }
      this.deliveryCost = element.ship_cost;
    });
    this.totalPaybaleCost = ((this.totalCost + this.deliveryCost) - this.couponDiscountCost)
    if (this.cartInfo != null && this.cartInfo.responseObject != null && this.cartInfo.responseObject.length > 0) {
      this.totalCartSize = this.cartInfo.responseObject.length;
    }
  }

  public goToPayment() {
    if (this.cartInfo != null && this.cartInfo.responseObject != null && this.cartInfo.responseObject.length > 0) {
      this.isCart = true;
    } else {
      this.isCart = false;
    }

  }

  public initializeValues() {
    this.totalCost = 0;
    this.deliveryCost = 0;
    this.couponDiscountCost = 0;
    this.totalPaybaleCost = 0;
    this.totalCartSize = 0;
  }

  public updateItemCountFromCartComp(product: Product, isAdd: boolean) {
    console.log("updateItemCountFromCartComp value", isAdd);
    this.cartService.updateItemCountFromCart(product, isAdd);
    this.shoppingCartItems = this.cartService.getItems();
  }

  public removeItemFromCartComp(product: Product) {
    this.cartService.removeProduct(product);
    this.shoppingCartItems = this.cartService.getItems();
  }

  public selectedIndex: number = 0;
  public selectionChange(event) {
    console.log("Event Obj :", event);
    if (event.selectedIndex == 0) {
    } else if (event.selectedIndex == 1) {
      this.getAddresses();
    } else if (event.selectedIndex == 2) {
      this.getCarts();
    } else if (event.selectedIndex == 3) {

    }
    return false;
  }

  public promoResponse: PromoResponse;
  public promoResponseModel: PromoResponseMode;

  validateCoupon() {
    this.subscriptions.add(this.validateCouponHttp().subscribe(data => {
      this.promoResponse = data;
      console.log("SC ", this.promoResponse.statusCode);
      if (this.promoResponse.statusCode == 302) {
        this.promoResponseModel = this.promoResponse.responseObjects;
        let discountType = this.promoResponseModel.mode_of_value;
        if (this.promoResponseModel.criteria.toLowerCase() == "y") {
          if (this.promoResponseModel.criteria_condition == ">=") {
            if (this.totalPaybaleCost > this.promoResponseModel.criteria_amount) {
              this.initializeValues();
              if (discountType == "D") {
                this.couponDiscountCost = this.promoResponseModel.value;
              } else {
                this.couponDiscountCost = ((this.promoResponseModel.value / 100) * this.totalPaybaleCost);
              }
            }
          } else {
            if (this.totalPaybaleCost > this.promoResponseModel.criteria_amount) {
              this.initializeValues();
              if (discountType == "D") {
                this.couponDiscountCost = this.promoResponseModel.value;
              } else {
                this.couponDiscountCost = ((this.promoResponseModel.value / 100) * this.totalPaybaleCost)
              }
            }
          }
        } else {
          this.initializeValues();
          this.couponDiscountCost = this.promoResponseModel.value;
        }
        this.calculatePrices();
      }
    }));
  }

  validateCouponHttp(): Observable<PromoResponse> {
    console.log("Coupon Code ", this.couponform.controls.couponcode.value);
    let body = {
      "countryCode": "us",
      "coupon_code": this.couponform.controls.couponcode.value,
    }
    let autherization = "Bearer " + this.userservice.getAuthToken();
    return this.http.post<PromoResponse>(this.APIEndpoint + "/coupon/applypromo",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
