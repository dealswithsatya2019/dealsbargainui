import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { cartInfo } from 'src/app/models/cartInfo';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-cartdetails',
  templateUrl: './cartdetails.component.html',
  styleUrls: ['./cartdetails.component.scss']
})
export class CartdetailsComponent implements OnInit {

  public cartInfo: cartInfo;
  public autherization: string = "Bearer 3ca9391f-fc0d-4291-983a-7a3f3e78349b";
  public productid: string;
  public catName: string;
  public subCatName: string;
  public supplierName: string;
  public userToken: string;
  public shoppingCartItems$: Observable<Product[]> = of([]);
  public shoppingCartItems: Product[] = [];
  public product: Product;

  constructor(public http: HttpClient, private _Activatedroute: ActivatedRoute, private cartService: CartService) {
    this.shoppingCartItems$ = this.cartService.getItems();
    this.shoppingCartItems$.subscribe(_ => this.shoppingCartItems = _);
  }

  public removeItem(item: Product) {
    this.cartService.removeFromCart(item)
  }

  ngOnInit() {
    let registerInfo = sessionStorage.getItem("success");
    if (registerInfo != null) {
      this.product = this.cartService.recentProduct();
      this.productid = this.product.product_id;
      this.catName = this.product.category    //   this.subCatName = decodeURI(params.get('scname'));
      this.subCatName = this.product.subcategory;
      this.supplierName = this.product.master_suplier;
      let userInfo = JSON.parse(registerInfo);
      this.autherization = "Bearer " + userInfo.responseObjects.access_token;
      this.addCart();
      this.getCarts();
    }
  }

  public getCarts() {
    this.getCartlist().subscribe(data =>
      this.cartInfo = data);
    this.shoppingCartItems = this.cartInfo.responseObject;
  }

  public addCartData: any;

  public addCart() {
    this.addProduToCart().subscribe(data => this.addCartData = data);
  }

  public getCartlist(): Observable<cartInfo> {
    return this.http.post<cartInfo>("http://34.233.128.163/api/v1/user/cart/operation/getCartInfo",
      { "countryCode": "us" }, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
  }

  public addProduToCart(): Observable<any> {
    let body = [
      {
        "countryCode": "us",
        "category": "books",
        "subcategory": "Crafts  &  hobbies",
        // "item_id": this.productid,
        "item_id": "aAFOL42L4fDj9ev6lDzjlQ==",
        "master_supplier": "doba",
        "count": "1"
      },
    ]
    return this.http.post<any>("http://34.233.128.163/api/v1/user/cart/operation/addItemToCart",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
  }

}
