import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ProductRouteInfo } from 'src/app/models/ProductRouteInfo';

@Injectable({
  providedIn: 'root'
})
export class ProductListRouteInfoService {

  private subject = new Subject<ProductRouteInfo>();

  addToCart(productRouteInfo : ProductRouteInfo) {
    this.subject.next(productRouteInfo);
  }

  clearCart() {
    this.subject.next();
  }

  getCart(): Observable<ProductRouteInfo> {
    return this.subject.asObservable();
  }

}
