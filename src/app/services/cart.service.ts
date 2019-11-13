import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

  constructor(public http: HttpClient){}

  public addToCart(item: Product) {
    console.log("Exist ", (this.itemsInCart.some(e => e.item_id === item.item_id)))
    this.itemsInCartTemp = [];
    if (this.itemsInCart.some(e => e.item_id === item.item_id)) {
      this.itemsInCart.forEach(element => {
        if (element.item_id == item.item_id) {
          element.quantity = (element.quantity + 1);
        }
        this.itemsInCartTemp.push(element)
      });
      this.itemsInCart = [];
      this.itemsInCart = this.itemsInCartTemp;
      console.log("Items :", this.itemsInCart);
    } else {
      item.quantity = 1;
      this.itemsInCart.push(item);
    }
    this.addedProduct = item;
    console.log("SIZE", this.itemsInCart.length);
    let access_token = sessionStorage.getItem("access_token");
    console.log("access_token :", access_token);
    if (access_token != null) {
      if (item != null) {
        this.autherization = "Bearer " + access_token;
        this.addCart(item);
        this.setRecentProduct();
      }
    }
  }

  public addCart(product: Product) {
    this.addProduToCart(product).subscribe(data => this.addCartData = data);
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

  public recentProduct(): Product {
    return this.addedProduct;
  }

  public setRecentProduct(): Product {
    return this.addedProduct = null;
  }

  public removeFromCart(item: Product) {
    this.itemsInCartTemp = [];
    if (this.itemsInCart.some(e => e.item_id === item.item_id)) {
      this.itemsInCart.forEach(element => {
        if (element.item_id == item.item_id) {
          element.quantity = (element.quantity - 1);
          if (element.quantity < 0) {
            element.quantity = 0;
          }
        }
        this.itemsInCartTemp.push(element)
      });
      this.itemsInCart = [];
      this.itemsInCart = this.itemsInCartTemp;
    }
  }

  public removeCart(item: Product) {
    this.itemsInCart = this.itemsInCart.filter(itemLoop => itemLoop.item_id != item.item_id);
  }

  public getItems(): Product[] {
    return this.itemsInCart;
  }

}