import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public itemsInCart: Product[] = [];
  public itemsInCartTemp: Product[] = [];
  public addedProduct: Product;
  public addCartData: any;
  public APIEndpoint: string = environment.APIEndpoint;
  public snackBarConfig: MatSnackBarConfig;

  constructor(public http: HttpClient, private _snackBar: MatSnackBar, public userService: UserService) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = "center";
    this.snackBarConfig.verticalPosition = "top";
    this.snackBarConfig.duration = 2000;
  }


  public recentProduct(): Product {
    return this.addedProduct;
  }

  public setRecentProduct(): Product {
    return this.addedProduct = null;
  }

  public setItems(item: Product) {
    this.itemsInCart.push(item);
  }

  public getItems(): Product[] {
    return this.itemsInCart;
  }

  raiseAlert(message: string) {
    this._snackBar.open(message, "", this.snackBarConfig);
  }

  public removeProductHttp(cart_id: string) {
    let body = {
      "countryCode": "us",
      "cart_id": cart_id
    }
    let autherization = "Bearer " + this.userService.getAuthToken();
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': autherization }), body
    };
    return this.http.delete(this.APIEndpoint + "/user/cart/operation/removeItemFromCart", httpOptions);
  }


  public addToCart(item: Product) {
    this.itemsInCartTemp = [];
    if (this.getItems().some(e => e.item_id === item.item_id)) {
      this.raiseAlert("This item is already added to cart.")
    } else {
      item.quantity = 1;
      this.setItems(item);
      this.raiseAlert("The item has been added to cart.")
    }
    if (this.userService.getAuthToken() != null && item != null) {
      this.addCart(item);
    }
  }

  public addCart(product: Product) {
    this.addCartHttp(product).subscribe(data => this.addCartData = data);
  }

  public addCartHttp(product: Product): Observable<any> {
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

  public updateCartHttp(product: Product): Observable<any> {
    let body =
    {
      "cartId": product.cart_id,
      "quantity": product.quantity,
      "code": "us",
    }
    console.log("body :", body);
    let autherization = "Bearer " + this.userService.getAuthToken();
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/updateQuantityCartItem/us",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': autherization } });
  }

  public clearCart() {
    this.itemsInCart = [];
    this.itemsInCartTemp = [];
  }
}