import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { searchreponse } from 'src/app/models/searchResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class WhishlistService {

  public itemsInWhishslist: Product[] = [];
  public itemsInWhishslistTemp: Product[] = [];
  public snackBarConfig: MatSnackBarConfig;	  

  constructor(private _httpCommonService: HttCommonService,private _snackBar: MatSnackBar, public _router: Router,public _userService: UserService) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = "center";
    this.snackBarConfig.verticalPosition = "top";
    this.snackBarConfig.duration = 2000;
  }

  public setItemsInWhishslist(produt){
    this.itemsInWhishslist.push(produt);
  }

  raiseAlert(message : string){
    this._snackBar.open(message, "", this.snackBarConfig);
  }

  public addToWhishlist(item: Product) {
    if(!this._userService.getAuthToken() || this._userService.getAuthToken().length==0){
      this.raiseAlert("Please login and add into your whishlist.");
    }
    if (this.itemsInWhishslist.some(e => e.item_id === item.item_id)) {
      this.raiseAlert("This item is already added to Whishlist.");
      return;
    } 
    if (this._userService.getAuthToken() != null && item != null) {
      this.callAddWhishlistAPI(item).subscribe(
        (data: searchreponse) => {
          if (data.statusCode == 200) {
            item.quantity = 1;
            this.itemsInWhishslist.push(item);
            this.raiseAlert("The item has been added to whishlist")
          }else{
            this.raiseAlert("Unable to add item into whishlist")
          }
        },
        (error: HttpErrorResponse) => {
          console.log('error============='+error);
        }
      );
    }
  }


  public removeFromWhishlist(item: Product) {
    if (this._userService.getAuthToken() != null) {
      this.itemsInWhishslist = this.itemsInWhishslist.filter(itemLoop => itemLoop.item_id != item.item_id);
      console.log("removeWhishlistProduct :", item);
      this.callRemoveWhishlistAPI(item).subscribe(
        (data: searchreponse) => {
          if (data.statusCode == 200) {
            this.raiseAlert("The selected item has been removed from Whishlist.");
            //this.itemsInWhishslist = this.itemsInWhishslist.filter(itemLoop => itemLoop.item_id != item.item_id);
          }else{
            this.raiseAlert("Unable to remove from whishlist.");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }



  public updateWhishlist() {
    if (this._userService.getAuthToken() != null) {
      this.callGetWhishlistAPI().subscribe(
        (data: searchreponse) => {
          if (data != null && data.responseObjects != null) {
            let alreadyWhishlist: Product[] = data.responseObjects;
            //console.log("Before Update whishlist  ", this.itemsInWhishslist);
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
            //console.log("After Update whishlist  ", this.itemsInWhishslist);
          } else if (this.itemsInWhishslist) {
            this.itemsInWhishslist.forEach(newWhislistProd => {
              this.addToWhishlist(newWhislistProd);
            });
          }
          //console.log("itemsInWhishslist ", this.itemsInWhishslist);
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
    return this._httpCommonService.postRequest('wishlist/create', JSON.stringify(body), this._userService.getAuthToken());
  }


  public callRemoveWhishlistAPI(product: Product): Observable<any> {
    const body = {
      "countryCode": "us",
      "id": product.wishlistId
    };
    return this._httpCommonService.postRequest('wishlist/remove', JSON.stringify(body), this._userService.getAuthToken());
  }

  public callGetWhishlistAPI(): Observable<any> {
    const body = {
      "countryCode": "us",
    };
    return this._httpCommonService.postRequest('user/wishlist/get', JSON.stringify(body), this._userService.getAuthToken());
  }

  public getItems(): Product[] {
    return this.itemsInWhishslist;
  }

  
  public clearWhislist() {
    this.itemsInWhishslist = [];
    this.itemsInWhishslistTemp = [];
  }
}
