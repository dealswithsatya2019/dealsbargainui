import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WhishlistService {

  private autherization: string;
  item_count: number =0;
  private itemsInWhichslist: Product[] = [];

  constructor(private _httpCommonService: HttCommonService, public _router: Router) { }

  
  public removeProduct(item: Product) {
    this.itemsInWhichslist = this.itemsInWhichslist.filter(itemLoop => itemLoop.item_id != item.item_id);
    let access_token = sessionStorage.getItem("access_token");
    console.log("access Token ", access_token);
    if (access_token != null) {
      console.log("removeProduct :", item);
      this.autherization = "Bearer " + access_token;
      const body ={
        "countryCode": countryCode,
        "category": cname,
        "subcategory": scname,
        "item_id": itemId,
        "rating": rating,
        "review_title": reviewTitle,
        "comment": comment,
        "master_suppler": masterSuppler,
        "product_recommended": productRecommended
      };
        return this._httpCommonService.postRequest('reviews/create-review', JSON.stringify(body), authToken);
    }
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
      alert("This item is already added to cart.");
    } else {
      item.quantity = 1;
      this.itemsInCart.push(item);
      console.log("Item cart ", this.getItems())
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
