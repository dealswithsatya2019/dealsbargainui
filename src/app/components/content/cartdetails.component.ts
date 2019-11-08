import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { cartInfo } from 'src/app/models/cartInfo';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from 'src/app/models/product';


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

  constructor(public http: HttpClient, private _Activatedroute: ActivatedRoute) {

  }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe((params: ParamMap) => {
      this.productid = decodeURI(params.get('pid'));
      this.catName = decodeURI(params.get('cname'));
      this.subCatName = decodeURI(params.get('scname'));
      this.supplierName = decodeURI(params.get('mastersupplier'));
    });
    let registerInfo = sessionStorage.getItem("success");
    console.log("sessionInfo :",registerInfo);
    if (registerInfo == null) {
      let cartInfo = sessionStorage.getItem("success");
    } else {
      let userInfo = JSON.parse(registerInfo);
      this.autherization = "Bearer " + userInfo.responseObjects.access_token;
      this.addCart();
      this.getCarts();
    }
  }

  public getCarts() {
    this.getCartlist().subscribe(data => this.cartInfo = data);
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
