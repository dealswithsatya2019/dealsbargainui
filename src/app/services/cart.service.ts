import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { element } from 'protractor';

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

  constructor(public http: HttpClient) { }

  public addToCart(item: Product) {
    let access_token = sessionStorage.getItem("access_token");
    this.itemsInCartTemp = [];
    let isProductExist = false;
    let totalCartCount = 0;
    if (this.itemsInCart.some(e => e.item_id === item.item_id)) {
      isProductExist = true;
      this.itemsInCart.forEach(element => {
        if (element.item_id == item.item_id) {
          element.quantity = (element.quantity + 1);
          totalCartCount = element.quantity;
        }
        this.itemsInCartTemp.push(element)
      });
      item.quantity = totalCartCount;
      this.itemsInCart = [];
      this.itemsInCart = this.itemsInCartTemp;
    } else {
      item.quantity = 1;
      this.itemsInCart.push(item);
      console.log("Item cart ",this.getItems())
    }
    this.addedProduct = item;
    if (access_token != null) {
      if (isProductExist) {
        item.quantity = totalCartCount;
        this.updateCart(item);
      } else {
        if (item != null) {
          this.autherization = "Bearer " + access_token;
          this.addCart(item);
          this.setRecentProduct();
        }
      }
    }
  }

  public addCart(product: Product) {
    this.addProduToCart(product).subscribe(data => this.addCartData = data);
  }

  public updateCart(product: Product) {
    this.updateProduToCart(product).subscribe(data => this.addCartData = data);
  }

  public updateProduToCart(product: Product): Observable<any> {
    let body = [
      {
        "cartId": product.cart_id,
        "quantity": product.quantity,
        "code": "us"
      },
    ]
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/updateQuantityCartItem/us",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
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
    console.log("Category :",product.category);
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/addItemToCart",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
  }

  public recentProduct(): Product {
    return this.addedProduct;
  }

  public setRecentProduct(): Product {
    return this.addedProduct = null;
  }

  public ItemFromCartChange(item: Product) {
    this.itemsInCartTemp = [];
    let totalCount = 0;
    if (this.itemsInCart.some(e => e.item_id === item.item_id)) {
      this.itemsInCart.forEach(element => {
        if (element.item_id == item.item_id) {
          element.quantity = (element.quantity - 1);
          totalCount = element.quantity;
          if (element.quantity < 0) {
            element.quantity = 0;
          }
        }
        this.itemsInCartTemp.push(element)
      });
      this.itemsInCart = [];
      this.itemsInCart = this.itemsInCartTemp;
      item.quantity = totalCount;
      this.updateCart(item);
    }
  }

  public removeCart(item: Product) {
    this.itemsInCart = this.itemsInCart.filter(itemLoop => itemLoop.item_id != item.item_id);
    let access_token = sessionStorage.getItem("access_token");
    if(access_token != null){
      this.removeProduct(item.cart_id);      
    }
  }

  public getItems(): Product[] {
    return this.itemsInCart;
  }

  public removeCartService(cartId) {
    this.removeProduct(cartId).subscribe();
  }

  public removeProduct(cart_id): Observable<any> {
    let body = {
      "countryCode": "us",
      "cart_id": cart_id
    }
    return this.http.post<any>(this.APIEndpoint + "/user/cart/operation/removeItemFromCart", body,
      { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
  }

}