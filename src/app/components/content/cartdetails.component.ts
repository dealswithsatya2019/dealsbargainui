import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { cartInfo } from 'src/app/models/cartInfo';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-cartdetails',
  templateUrl: './cartdetails.component.html',
  styleUrls: ['./cartdetails.component.scss']
})
export class CartdetailsComponent implements OnInit {

  public cartInfo: cartInfo;
  public autherization: string;
  public userToken: string;
  public shoppingCartItems: Product[] = [];
  public product: Product;
  private APIEndpoint: string = environment.APIEndpoint;

  constructor(public http: HttpClient, private _Activatedroute: ActivatedRoute, private cartService: CartService, public _router: Router) {
  }

  ngOnInit() {
    this.shoppingCartItems = [];
    this.shoppingCartItems = this.cartService.getItems();
    console.log("Items in cart page ", this.shoppingCartItems);
    let access_token = sessionStorage.getItem("access_token");
    console.log("access_token :",access_token);
    if (access_token != null) {
      console.log("access token not null...");
      this.product = this.cartService.recentProduct();
      if (this.product != null) {
        this.autherization = "Bearer " + access_token;
        this.addCart(this.product);
        this.cartService.setRecentProduct();
      }
      this.getCarts();
    }
  }

  public getCarts() {
    this.getCartlist().subscribe(data =>
      this.cartInfo = data);
    if (this.cartInfo != null && this.cartInfo.responseObject != null) {
      this.shoppingCartItems = this.cartInfo.responseObject;
    }

  }

  public addCartData: any;

  public addCart(product: Product) {
    this.addProduToCart(product).subscribe(data => this.addCartData = data);
  }

  public getCartlist(): Observable<cartInfo> {
    return this.http.post<cartInfo>(this.APIEndpoint + "/user/cart/operation/getCartInfo",
      { "countryCode": "us" }, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
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
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/addItemToCart",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
  }

  public addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.shoppingCartItems = this.cartService.getItems();
    if (this.autherization != null) {
      this.addCart(product);
    }
    this._router.navigateByUrl('/mycart');
  }

  public removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
    this.shoppingCartItems = this.cartService.getItems();
    this._router.navigateByUrl('/mycart');
  }

  public removeProduct(product: Product) {
    this.cartService.removeCart(product);
    this.shoppingCartItems = this.cartService.getItems();
    this._router.navigateByUrl('/mycart');
  }

}
