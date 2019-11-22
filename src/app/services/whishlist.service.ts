import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { searchreponse } from 'src/app/models/searchResponse';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WhishlistService {

  public access_token: string;
  public addWhislistData: any;
  private itemsInWhishslist: Product[] = [];
  private itemsInWhishslistTemp: Product[] = [];

  constructor(private _httpCommonService: HttCommonService, public _router: Router) {
    this.access_token = sessionStorage.getItem("access_token");
  }

  public setItemsInWhishslist(produt){
    this.itemsInWhishslist.push(produt);
  }

  public addToWhishlist(item: Product) {
    if (this.itemsInWhishslist.some(e => e.item_id === item.item_id)) {
      alert("This item is already added to cart.");
    } else {
      item.quantity = 1;
      this.itemsInWhishslist.push(item);
    }
    if (this.access_token != null && item != null) {
      console.log("addWhishlistProduct :", item);
      this.callAddWhishlistAPI(item).subscribe(
        (data: searchreponse) => {
          if (data.responseObjects && data.statusCode == 200) {
            this.addWhislistData = data
          }
        },
        (error: HttpErrorResponse) => {
          console.log('error============='+error);
        }
      );
    }
  }


  public removeFromWhishlist(item: Product) {
    if (this.access_token != null) {
      this.itemsInWhishslist = this.itemsInWhishslist.filter(itemLoop => itemLoop.item_id != item.item_id);
      console.log("removeWhishlistProduct :", item);
      this.callRemoveWhishlistAPI(item).subscribe(
        (data: searchreponse) => {
          if (data.responseObjects && data.statusCode == 200) {
            //this.itemsInWhishslist = this.itemsInWhishslist.filter(itemLoop => itemLoop.item_id != item.item_id);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }



  public updateWhishlist() {
    if (this.access_token != null) {
      this.callGetWhishlistAPI().subscribe(
        (data: searchreponse) => {
          if (data != null && data.responseObjects != null) {
            let alreadyWhishlist: Product[] = data.responseObjects;
            console.log("Before Update whishlist  ", this.itemsInWhishslist);
            alreadyWhishlist.forEach(alreadyWhishlistItem => {
              if (alreadyWhishlistItem.quantity == undefined || alreadyWhishlistItem.quantity == 0) {
                alreadyWhishlistItem.quantity = 1;
              }
              let newWhislistProd = this.itemsInWhishslist.find(newObj => newObj.item_id !== alreadyWhishlistItem.item_id);
              if (newWhislistProd !== undefined) {
                alreadyWhishlist.push(newWhislistProd);
                this.addToWhishlist(newWhislistProd);
              }
            });
            this.itemsInWhishslist = alreadyWhishlist;
            console.log("After Update whishlist  ", this.itemsInWhishslist);
          } else if (this.itemsInWhishslist) {
            this.itemsInWhishslist.forEach(newWhislistProd => {
              this.addToWhishlist(newWhislistProd);
            });
          }
          console.log("itemsInWhishslist ", this.itemsInWhishslist);
        }),
        (error) => {
          console.log(error);
        };
    }
  }

  public callAddWhishlistAPI(product: Product): Observable<any> {
    const body = {
      "countryCode": "us",
      "category": product.category,
      "subcategory": product.subcategory,
      "item_id": product.item_id,
      "master_supplier": product.master_suplier
    };
    return this._httpCommonService.postRequest('wishlist/create', JSON.stringify(body), this.access_token);
  }


  public callRemoveWhishlistAPI(product: Product): Observable<any> {
    const body = {
      "countryCode": "us",
      "id": product.wishlistId
    };
    return this._httpCommonService.postRequest('wishlist/remove', JSON.stringify(body), this.access_token);
  }

  public callGetWhishlistAPI(): Observable<any> {
    const body = {
      "countryCode": "us",
    };
    return this._httpCommonService.postRequest('user/wishlist/get', JSON.stringify(body), this.access_token);
  }

  public getItems(): Product[] {
    return this.itemsInWhishslist;
  }

  
  public clearWhislist() {
    this.itemsInWhishslist = [];
    this.itemsInWhishslistTemp = [];
  }
}
