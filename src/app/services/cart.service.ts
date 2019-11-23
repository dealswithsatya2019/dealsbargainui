import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsInCart: Product[] = [];
  private itemsInCartTemp: Product[] = [];
  private addedProduct: Product;
  private autherization: string;
  public addCartData: any;
  private APIEndpoint: string = environment.APIEndpoint;
  public snackBarConfig: MatSnackBarConfig;	  

  constructor(public http: HttpClient,private _snackBar: MatSnackBar) { 
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

  public removeProduct(item: Product) {
    this.itemsInCart = this.itemsInCart.filter(itemLoop => itemLoop.item_id != item.item_id);
    let access_token = sessionStorage.getItem("access_token");
    console.log("access Token ", access_token);
    if (access_token != null) {
      console.log("removeProduct :", item);
      this.autherization = "Bearer " + access_token;
      this.removeProductHttp(item.cart_id).subscribe();
    }
    this.raiseAlert("The selected item has been removed from cart.");
  }

  raiseAlert(message : string){
    this._snackBar.open(message, "", this.snackBarConfig);
  }

  public removeProductHttp(cart_id: string) {
    let body = {
      "countryCode": "us",
      "cart_id": cart_id
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.autherization }), body
    };
    return this.http.delete(this.APIEndpoint + "/user/cart/operation/removeItemFromCart", httpOptions);
  }


  public addToCart(item: Product) {
    let access_token = sessionStorage.getItem("access_token");
    this.itemsInCartTemp = [];
    if (this.itemsInCart.some(e => e.item_id === item.item_id)) {
      this.raiseAlert("This item is already added to cart.")
    } else {
      item.quantity = 1;
      this.itemsInCart.push(item);
      console.log("Item cart ", this.getItems())
      this.raiseAlert("The item has been added to cart.")
    }
    if (access_token != null && item != null) {
      this.autherization = "Bearer " + access_token;
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
    console.log("Category :", product.category);
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/addItemToCart",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
  }


  public updateItemCountFromCart(item: Product, isAdd: boolean) {
    this.itemsInCartTemp = [];
    let access_token = sessionStorage.getItem("access_token");
    if (this.itemsInCart.some(e => e.item_id === item.item_id)) {
      console.log("Items in cart true", this.itemsInCart.length);
      this.itemsInCart.forEach(element => {
        if (element.item_id == item.item_id) {
          console.log("condition  satisfied true", element.item_id);
          element.quantity = element.quantity >= 0 ? (isAdd ? (element.quantity + 1) : (element.quantity - 1)) : 1;
          if (access_token != null) {
            this.autherization = "Bearer " + access_token;
            this.updateCart(element);
            console.log("element ", element);
          }
        }
        this.itemsInCartTemp.push(element);
      });
      this.itemsInCart = [];
      this.itemsInCart = this.itemsInCartTemp;
      this.raiseAlert("The item count has been updated to cart.");
      console.log("updateItemCountFromCart", this.getItems());
    }
  }

  public updateCart(product: Product) {
    this.updateCartHttp(product).subscribe(data => this.addCartData = data);
  }

  public updateCartHttp(product: Product): Observable<any> {
    let body =
    {
      "cartId": product.cart_id,
      "quantity": product.quantity,
      "code": "us",
    }
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/updateQuantityCartItem/us",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
  }

  public clearCart() {
    this.itemsInCart = [];
    this.itemsInCartTemp = [];
  }
}