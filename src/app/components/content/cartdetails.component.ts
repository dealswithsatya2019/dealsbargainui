import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { cartInfo } from 'src/app/models/cartInfo';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/user.service';


@Component({
  selector: 'app-cartdetails',
  templateUrl: './cartdetails.component.html',
  styleUrls: ['./cartdetails.component.scss']
})

export class CartdetailsComponent implements OnInit, OnDestroy {

  public cartInfo: cartInfo;
  //public autherization: string;
  public userToken: string;
  public shoppingCartItems: Product[] = [];
  public product: Product;
  private APIEndpoint: string = environment.APIEndpoint;
  private deliverydate_configurable_days = environment.DeliveryDate_Configurable_days;
  subscriptions = new Subscription();
  send_date = new Date();
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;

  constructor(public http: HttpClient, private _Activatedroute: ActivatedRoute, private cartService: CartService, public _router: Router,
    public userService: UserService) {
    this.send_date.setHours(this.send_date.getHours() + (this.deliverydate_configurable_days * 24));
  }

  ngOnInit() {
    this.shoppingCartItems = [];
    let access_token = sessionStorage.getItem("access_token");
    console.log("access_token :", access_token);
    if (this.userService.getAuthToken != null) {
      //this.autherization = "Bearer " + access_token;
      this.getCarts();
    } else {
      this.shoppingCartItems = this.cartService.getItems();
      console.log("Items in cart page ", this.shoppingCartItems);
    }
  }

  public addCartData: any;

  public addCart(product: Product) {
    this.subscriptions.add(this.subscriptions.add(this.addProduToCart(product).subscribe(data => this.addCartData = data)));
  }

  public addProduToCart(product: Product): Observable<any> {
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
    let autherization = "Bearer " + this.userService.getAuthToken();
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/addItemToCart",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  }

  public addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.shoppingCartItems = this.cartService.getItems();
    let autherization = "Bearer " + this.userService.getAuthToken();
    if (autherization != null) {
      this.addCart(product);
    }
    this._router.navigateByUrl('/mycart');
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

  public getCarts() {
    console.log("get Cart api called...");
    this.subscriptions.add(this.getCartlist().subscribe(data => {
      this.cartInfo = data;
      this.shoppingCartItems = [];
      if (this.cartInfo != null && this.cartInfo.responseObject != null) {
        this.shoppingCartItems = [];
        this.cartInfo.responseObject.forEach(element => {
          if (element.quantity == 0) {
            element.quantity = 1;
          }
          this.cartService.setItems(element);
          this.shoppingCartItems.push(element);
        });
        console.log("shoppingCartItems ", this.shoppingCartItems);
      }
    }
    ));
  }

  public getCartlist(): Observable<cartInfo> {
    let autherization = "Bearer " + this.userService.getAuthToken();
    return this.http.post<cartInfo>(this.APIEndpoint + "/user/cart/operation/getCartdetails/us",
      { "countryCode": "us" }, { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
