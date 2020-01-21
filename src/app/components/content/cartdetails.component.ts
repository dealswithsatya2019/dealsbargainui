import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { cartInfo } from 'src/app/models/cartInfo';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/user.service';
import { AddProductReq } from './addproductreq';


@Component({
  selector: 'app-cartdetails',
  templateUrl: './cartdetails.component.html',
  styleUrls: ['./cartdetails.component.scss']
})

export class CartdetailsComponent implements OnInit, OnDestroy {

  public cartInfo: cartInfo;
  public userToken: string;
  public shoppingCartItems: Product[] = [];
  public product: Product;
  private APIEndpoint: string = environment.APIEndpoint;
  private deliverydate_configurable_days = environment.DeliveryDate_Configurable_days;
  subscriptions = new Subscription();
  send_date = new Date();
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;
  public isLoader: boolean = true;
  public color = 'primary';
  public mode = 'indeterminate';
  public value = 50;


  constructor(public http: HttpClient, private _Activatedroute: ActivatedRoute, private cartService: CartService, public _router: Router,
    public userService: UserService) {
    this.send_date.setHours(this.send_date.getHours() + (this.deliverydate_configurable_days * 24));
  }

  public addCartData: any;
  public addProductsArray: AddProductReq[] = [];
  public productReq: AddProductReq;

  public addCart() {
    this.subscriptions.add(this.addProduToCart().subscribe(data => {
      this.addCartData = data;
      this.getCarts();
    }));
  }

  public addProduToCart(): Observable<any> {
    this.cartService.getItems().forEach(element => {
      this.productReq = new AddProductReq();
      this.productReq.category = element.category;
      this.productReq.countryCode = "us";
      this.productReq.quantity = element.quantity + "";
      this.productReq.item_id = element.item_id;
      this.productReq.master_supplier = element.master_suplier;
      this.productReq.subcategory = element.subcategory;
      this.addProductsArray.push(this.productReq);
    });
    let body = JSON.stringify(this.addProductsArray);
    console.log("BODY", body);
    let autherization = "Bearer " + this.userService.getAuthToken();
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/addItemToCart",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  }


  ngOnInit() {
    this.shoppingCartItems = [];
    if (this.userService.getCheckoutNavigateFlag()) {
      this.userService.setQuickByNavigateFlag(false);
      this.userService.setCheckoutNavigateFlag(false);
      if (this.cartService.getItems() != null && this.cartService.getItems().length > 0) {
        this.addCart();
      } else {
        this.cartService.clearCart();
        this.getCarts();
      }
    } else {
      this.cartService.clearCart();
      this.getCarts();
    }
    // } 
    // else {
    //   this.shoppingCartItems = this.cartService.getItems();
    //   this.isLoader = false;
    // }
  }

  // public addCart(product: Product) {
  //   this.subscriptions.add(this.addProduToCart(product).subscribe(data => this.addCartData = data));
  // }

  // public addProduToCart(product: Product): Observable<any> {
  //   let body = [
  //     {
  //       "countryCode": "us",
  //       "category": product.category,
  //       "subcategory": product.subcategory,
  //       "item_id": product.item_id,
  //       "master_supplier": product.master_suplier,
  //       "quantity": "1"
  //     },
  //   ]
  //   let autherization = "Bearer " + this.userService.getAuthToken();
  //   return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/addItemToCart",
  //     body, { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  // }

  // public addToCart(product: Product) {
  //   this.cartService.addToCart(product);
  //   this.shoppingCartItems = this.cartService.getItems();
  //   let autherization = "Bearer " + this.userService.getAuthToken();
  //   if (autherization != null) {
  //     this.addCart(product);
  //   }
  //   this._router.navigateByUrl('/mycart');
  // }

  public updateItemCountFromCartComp(item: Product, isAdd: boolean) {
    this.cartService.itemsInCartTemp = [];
    if (this.cartService.itemsInCart.some(e => e.item_id === item.item_id)) {
      this.cartService.itemsInCart.forEach(element => {
        if (element.item_id == item.item_id) {
          let quantity = element.quantity >= 0 ? (isAdd ? (element.quantity + 1) : (element.quantity - 1)) : 1;
          if (quantity > 0) {
            element.quantity = quantity;
            this.cartService.raiseAlert("The item count has been updated to cart.");
            if (this.userService.getAuthToken() != null) {
              this.subscriptions.add(this.cartService.updateCartHttp(element).subscribe(data => {
                // this.addCartData = data;
              }));
            }
          } else {
            this.cartService.raiseAlert("The Product quantity should be greater than one.")
          }
        }
        this.cartService.itemsInCartTemp.push(element);
      });
      this.cartService.itemsInCart = [];
      this.cartService.itemsInCart = this.cartService.itemsInCartTemp;
      this.shoppingCartItems = this.cartService.getItems();
    }
  }

  public removeItemFromCartComp(item: Product) {
    this.cartService.itemsInCart = this.cartService.itemsInCart.filter(itemLoop => itemLoop.item_id != item.item_id);
    if (this.userService.getAuthToken() != null) {
      this.subscriptions.add(this.cartService.removeProductHttp(item.cart_id).subscribe(data => {
        this.cartService.raiseAlert("The selected item has been removed from cart.");
      }));
    }
    this.shoppingCartItems = this.cartService.getItems();
  }

  public getCarts() {
    this.cartService.clearCart();
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
        this.isLoader = false;
        console.log("cart service ...");
      } else {
        this.isLoader = false;
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
