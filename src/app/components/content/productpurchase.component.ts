import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import * as CryptoJS from 'crypto-js';
import { Observable, Subscription } from 'rxjs';
import { address } from 'src/app/models/address';
import { addressResponse } from 'src/app/models/addressResponse';
import { AuthResopnse2 } from 'src/app/models/ApiResponse2';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import { cartInfo } from 'src/app/models/cartInfo';
import { CreateOrederReq } from 'src/app/models/CreateOrederReq';
import { Product } from 'src/app/models/product';
import { OrderItenInfo } from 'src/app/modules/OrderItemInfo';
import { AuthService as UserAuth } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { LoginformService } from 'src/app/services/forms/loginform.service';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/environments/environment';
import { AddProductReq } from './addproductreq';
import { PromoResponse } from './promoResponse';
import { PromoResponseMode } from './promoResponseModel';
import { WhishlistService } from 'src/app/services/whishlist.service';
import { MyprofileService } from 'src/app/services/myprofile.service';
import { AlertService } from 'src/app/services/alert.service';
declare let paypal: any;

@Component({
  selector: 'app-productpurchase',
  templateUrl: './productpurchase.component.html',
  styleUrls: ['./productpurchase.component.scss']
})
export class ProductpurchaseComponent implements OnInit {
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
  public statesArr = JSON.parse(environment.STATES);
  public shoppingCartItems: Product[] = [];
  subscriptions = new Subscription();
  send_date = new Date();
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;

  private deliverydate_configurable_days = environment.DeliveryDate_Configurable_days;


  addressform: FormGroup = new FormGroup({
    countrycode: new FormControl('us'),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mobile_number: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    zipcode: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    address: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    altphone: new FormControl('', [Validators.pattern('[0-9]+')]),
    address_type: new FormControl('', [Validators.required]),
    country: new FormControl('United States', [Validators.required]),

  });

  updateaddressform: FormGroup = new FormGroup({
    countrycode: new FormControl('us'),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mobile_number: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    zipcode: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    altphone: new FormControl('', [Validators.pattern('[0-9]+')]),
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
    private cartService: CartService,
    public _profileInfoService: MyprofileService,
    public whishlistService: WhishlistService,
    public _alertService: AlertService) {
    this.send_date.setHours(this.send_date.getHours() + (this.deliverydate_configurable_days * 24));
  }


  ngOnInit() {
    this.loginformService.resetForm();
    if (this.userservice.getAuthToken() != null) {
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
            ], application_context: {
              'shipping_preference': 'NO_SHIPPING',
              "locale": "en-US",
            }
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
          this.createOrder(orderId);
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
            this.isLogIn = true;
            this.userservice.form.controls['name'].setValue(userInfo.name);
            this.userservice.setAuthToken(authResponse.responseObjects.sn);
            this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
            this.loginformService.response = JSON.parse(JSON.stringify(this.loginformService.form.value));
            sessionStorage.setItem("sn", authResponse.responseObjects.sn);
            this.userservice.resetForm();
            this._profileInfoService.funSetUserProfile();
            this.whishlistService.updateWhishlist();
            this.addCart();
          } else {
            this.loginErrorMsg = authResponse.statusDesc;
          }
        },
        (error: HttpErrorResponse) => {
          this.loginErrorMsg = error.error.statusDesc;
        }
      )
      );
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
    sessionStorage.removeItem("sn");
    this._router.navigateByUrl("/");
  }

  funSave() {
    let mobilenumber = this.addressform.controls.mobile_number.value;
    mobilenumber = "1" + mobilenumber;
    this.addressform.controls['mobile_number'].setValue(mobilenumber);
    let altphone = this.addressform.controls.altphone.value;
    if (altphone != null && altphone.length > 0) {
      altphone = "1" + altphone;
      this.addressform.controls['altphone'].setValue(altphone);
    }
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
      if (this.cartInfo != null && this.cartInfo.responseObject != null) {
        this.isCart = true;
        this.cartService.clearCart();
        this.cartInfo.responseObject.forEach(element => {
          element.quantity = element.quantity == 0 ? 1 : element.quantity;
          this.cartService.setItems(element);
        });
        this.shoppingCartItems = [];
        this.shoppingCartItems = this.cartService.getItems();
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
    this.updateaddressform.controls.firstName.setValue(this.address.firstName);
    this.updateaddressform.controls.lastName.setValue(this.address.lastName);
    this.updateaddressform.controls.mobile_number.setValue(this.address.mobile_number.substr(1));
    this.updateaddressform.controls.altphone.setValue(this.address.altphone != null ? this.address.altphone.substr(1) : this.address.altphone);
    this.updateaddressform.controls.address.setValue(this.address.address);
    this.updateaddressform.controls.city.setValue(this.address.city);
    this.updateaddressform.controls.country.setValue(this.address.country);
    this.updateaddressform.controls.state.setValue(this.address.state);
    this.updateaddressform.controls.zipcode.setValue(this.address.zipcode);
    this.updateaddressform.controls.address_type.setValue(this.address.address_type);
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


  public createOrderReq: CreateOrederReq;
  public itemsInfo: OrderItenInfo;
  public addOrdersArray: OrderItenInfo[] = [];


  public createOrderData: AuthResopnse2;

  public createOrderHttp(OrderId: string): Observable<AuthResopnse2> {

    this.createOrderReq = new CreateOrederReq();

    this.shoppingCartItems.forEach(element => {
      this.itemsInfo = new OrderItenInfo();
      this.itemsInfo.category = element.category;
      this.itemsInfo.item_id = element.item_id;
      this.itemsInfo.master_supplier = element.master_suplier;
      this.itemsInfo.subcategory = element.subcategory;
      this.itemsInfo.countryCode = "us";
      this.itemsInfo.quantity = element.quantity;
      this.addOrdersArray.push(this.itemsInfo);
    });
    this.createOrderReq.items_info = this.addOrdersArray;
    this.createOrderReq.address_id = this.selectedAddressId;
    this.createOrderReq.coupon_applied = "no";
    this.createOrderReq.coupon_id = "";
    this.createOrderReq.net_amount = this.totalPaybaleCost;
    this.createOrderReq.order_id_by_payment_channel = OrderId;
    this.createOrderReq.payment_channel = "paypal";
    this.createOrderReq.transaction_fee = this.transactionCostFromDBAPI;
    this.createOrderReq.user_payment_request_status = "success";

    let body = JSON.stringify(this.createOrderReq);
    let autherization = "Bearer " + this.userservice.getAuthToken();
    return this.http.post<AuthResopnse2>(this.APIEndpoint + "/order/create-order/us",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  }

  public createOrder(orderId: string) {
    this.subscriptions.add(this.createOrderHttp(orderId).subscribe(data => {
      this.createOrderData = data;
      console.log("Order Status :", this.createOrderData.statusCode);
      if (this.createOrderData != null && this.createOrderData.statusCode == 200) {
        console.log("Order Status myprofile:", this.createOrderData.statusCode);
        this._router.navigate(['myprofile', { outlets: { 'profileoutlet': ['orders'] } }]);
      } else {
        console.log("Order Status mycart:", this.createOrderData.statusCode);
        this._router.navigateByUrl("/mycart");
      }
    }));
  }

  public totalCost: number = 0;
  public transactionCostFromDBAPI: number = 0;
  public couponDiscountCost: number = 0;
  public totalPaybaleCost: number = 1;
  public totalCartSize: number = 0;

  public calculatePrices() {
    console.log("calculatePrices", this.shoppingCartItems.length);
    this.shoppingCartItems.forEach(element => {
      console.log("quantity :", element.quantity);
      if (element.dealtype != '') {
        let productcost = element.quantity > 0 ? (element.quantity * element.deals_bargain_deal_price) : element.deals_bargain_deal_price
        this.totalCost = this.totalCost + productcost;
      } else if (element.dealtype == '' && element.discount == '0') {
        let productcost = element.quantity > 0 ? (element.quantity * element.price) : element.price
        this.totalCost = this.totalCost + productcost;
      } else if (element.dealtype == '' && element.discount != '0') {
        let productcost = element.quantity > 0 ? (element.quantity * element.discount_amount) : element.discount_amount
        this.totalCost = this.totalCost + productcost;
      }
      if (element.transaction_fees != null && element.transaction_fees != undefined && element.transaction_fees > 0) {
        this.transactionCostFromDBAPI = element.transaction_fees + this.transactionCostFromDBAPI;
      }
    });
    this.totalPaybaleCost = ((this.totalCost + this.transactionCostFromDBAPI) - this.couponDiscountCost);
    if (this.cartInfo != null && this.cartInfo.responseObject != null && this.cartInfo.responseObject.length > 0) {
      this.totalCartSize = this.cartInfo.responseObject.length;
    }
  }

  public initializeValues() {
    this.totalCost = 0;
    this.transactionCostFromDBAPI = 0;
    this.couponDiscountCost = 0;
    this.totalPaybaleCost = 0;
    this.totalCartSize = 0;
  }

  public removeItemFromCartComp(item: Product) {
    this.cartService.itemsInCart = this.cartService.itemsInCart.filter(itemLoop => itemLoop.item_id != item.item_id);
    if (this.userservice.getAuthToken() != null) {
      this.subscriptions.add(this.cartService.removeProductHttp(item.cart_id).subscribe(data => {
        this.cartService.raiseAlert("The selected item has been removed from cart.");
        this.getCarts();
      }));
    }
  }

  public updateItemCountFromCartComp(item: Product, isAdd: boolean) {
    let isLoopReq: boolean = true;
    if (this.cartService.itemsInCart.some(e => e.item_id === item.item_id)) {
      this.cartService.itemsInCart.forEach(element => {
        if (isLoopReq) {
          if (element.item_id == item.item_id) {
            element.quantity = element.quantity >= 0 ? (isAdd ? (element.quantity + 1) : (element.quantity - 1)) : 1;
            if (this.userservice.getAuthToken() != null) {
              this.subscriptions.add(this.cartService.updateCartHttp(element).subscribe(data => {
                this.cartService.raiseAlert("The item count has been updated to cart.");
                this.addCartData = data;
                this.getCarts();
              }));
              isLoopReq = false;
            }
          }
        }
      });
    }
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
