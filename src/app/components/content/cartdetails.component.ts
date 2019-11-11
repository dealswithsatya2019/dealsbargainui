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
    let access_token = sessionStorage.getItem("access_token");
    if (access_token != null) {
      this.product = this.cartService.recentProduct();
      this.productid = this.product.item_id;
      this.catName = this.product.category   
      this.subCatName = this.product.subcategory;
      this.supplierName = this.product.master_suplier;
      this.autherization = "Bearer " + access_token;
      console.log("Product Details :",this.product);
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
        "category": this.catName,
        "subcategory": this.subCatName,
        "item_id": this.productid,
        "master_supplier": this.supplierName,
        "count": "1"
      },
    ]
    return this.http.post<any>("http://34.233.128.163/api/v1/user/cart/operation/addItemToCart",
      body, { headers: { 'Content-Type': 'application/json', 'authorization': this.autherization } });
  }

}
