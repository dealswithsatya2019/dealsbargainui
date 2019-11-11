import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsInCartSubject: BehaviorSubject<Product[]> = new BehaviorSubject([]);
  private itemsInCart: Product[] = [];
  private addedProduct: Product;
  constructor() {
    this.itemsInCartSubject.subscribe(_ => this.itemsInCart = _);
  }

  public addToCart(item: Product) {
    this.itemsInCartSubject.next([...this.itemsInCart, item]);
    this.addedProduct = item;
  }

  public recentProduct(): Product {
    return this.addedProduct;
  }

  public removeFromCart(item: Product) {
    const currentItems = [...this.itemsInCart];
    const itemsWithoutRemoved = currentItems.filter(_ => _.item_id !== item.item_id);
    this.itemsInCartSubject.next(itemsWithoutRemoved);
  }

  public getItems(): Observable<Product[]> {
    return this.itemsInCartSubject.asObservable();
  }

  // public getTotalAmount(): Observable<number> {
  //   return this.itemsInCartSubject.map((items: Product[]) => {
  //     return items.reduce((prev, curr: Product) => {
  //       return prev + curr.price;
  //     }, 0);
  //   });
  // }



}
