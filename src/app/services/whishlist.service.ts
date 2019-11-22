import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { searchreponse } from 'src/app/models/searchResponse';

@Injectable({
  providedIn: 'root'
})
export class WhishlistService {

  private access_token: string;
  public addWhislistData: any;
  private itemsInWhishslist: Product[] = [];
  private itemsInWhishslistTemp: Product[] = [];

  constructor(private _httpCommonService: HttCommonService, public _router: Router) {
    this.access_token = sessionStorage.getItem("access_token");
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
        (error) => {
          console.log(error);
        }
      );
    }
  }


  public removeFromWhishlist(item: Product) {
    this.itemsInWhishslist = this.itemsInWhishslist.filter(itemLoop => itemLoop.item_id != item.item_id);
    if (this.access_token != null) {
      console.log("removeWhishlistProduct :", item);
      this.callRemoveWhishlistAPI(item).subscribe(
        (data: searchreponse) => {
          if (data.responseObjects && data.statusCode == 200) {
            this.addWhislistData = data
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  public getWhishlist() : any[]{
    /*if (this.access_token != null) {
      console.log("getWhishlist :");
      this.callGetWhishlistAPI().subscribe(
        (data: searchreponse) => {
          if (data != null && data.responseObject != null) {
            this.itemsInWhishslist = data.responseObjects;
            this.itemsInWhishslist.forEach(element => {
              if (element.quantity == 0) {
                element.quantity = 1;
              }
              this.itemsInWhishslist.push(element);
            });
            console.log("shoppingCartItems ", this.itemsInWhishslist);
          }
        }),
        (error) => {
          console.log(error);
        };
    }*/
    return this.itemsInWhishslist;
  }

  public updateWhishlist() {
   /* if (this.access_token != null) {
      console.log("getWhishlist :");
      this.callGetWhishlistAPI().subscribe(
        (data: searchreponse) => {
          let alreadyWhishlist: Product[] = [];
          if (data != null && data.responseObjects != null) {
            console.log("Before Update whishlist  ", this.itemsInWhishslist);
            alreadyWhishlist.forEach(alreadyWhishlistItem => {
              if (alreadyWhishlistItem.quantity == 0) {
                alreadyWhishlistItem.quantity = 1;
              }
              alreadyWhishlist.push(alreadyWhishlistItem);
              let newWhislistProd = this.itemsInWhishslist.find(newObj => newObj.item_id !== alreadyWhishlistItem.item_id);
              if (newWhislistProd !== null) {
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
          console.log("shoppingCartItems ", this.itemsInWhishslist);
        }),
        (error) => {
          console.log(error);
        };
    }*/
  }

  private callAddWhishlistAPI(product: Product): Observable<any> {
    const body = {
      "countryCode": "us",
      "category": product.category,
      "subcategory": product.subcategory,
      "item_id": product.item_id,
      "master_supplier": product.master_suplier
    };
    return this._httpCommonService.postRequest('wishlist/create', JSON.stringify(body), this.access_token);
  }


  private callRemoveWhishlistAPI(product: Product): Observable<any> {
    const body = {
      "countryCode": "us",
      "id": product.item_id
    };
    return this._httpCommonService.postRequest('wishlist/remove', JSON.stringify(body), this.access_token);
  }

  private callGetWhishlistAPI(): Observable<any> {
    const body = {
      "countryCode": "us",
    };
    return this._httpCommonService.postRequest('wishlist/get', JSON.stringify(body), this.access_token);
  }

  public getItems(): Product[] {
    return this.itemsInWhishslist;
  }

  
  public clearCart() {
    this.itemsInWhishslist = [];
    this.itemsInWhishslistTemp = [];
  }
}
