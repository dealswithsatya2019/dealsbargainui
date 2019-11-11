import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsInCart: Product[] = [];
  private itemsInCartTemp: Product[] = [];
  private addedProduct: Product;

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
  }

  public recentProduct(): Product {
    return this.addedProduct;
  }

  public removeFromCart(item: Product) {
    this.itemsInCartTemp = [];
    if (this.itemsInCart.some(e => e.item_id === item.item_id)) {
      this.itemsInCart.forEach(element => {
        if (element.item_id == item.item_id) {
          element.quantity = (element.quantity - 1);
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
