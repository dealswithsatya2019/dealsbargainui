import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/models/product';
import { WhishlistService } from 'src/app/services/whishlist.service';
import { environment } from 'src/environments/environment';
import { searchreponse } from 'src/app/models/searchResponse';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/user.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  @Input() public productInfo: Product;
  @Input() public actionType: string = 'list';
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;
  public shoppingCartItems: Product[] = [];
  
  constructor(public _whishlistService: WhishlistService, 
    private _cartService: CartService,
    private _userService: UserService,
    public _productservice: ProductService ) {
    
  }

  ngOnInit() {
    if (this.actionType === 'list') {
      this._whishlistService.clearWhislist();
      this.getWhishlist();
    }
  }

  public getWhishlist() {
    if (this._userService.getAuthToken() != null) {
      this._whishlistService.callGetWhishlistAPI().subscribe(
        (data: searchreponse) => {
          if (data != undefined && data.responseObjects != undefined) {
            let alreadyExistWhishlist = data.responseObjects;
            alreadyExistWhishlist.forEach(element => {
              if (element.quantity == undefined || element.quantity == 0) {
                element.quantity = 1;
              }
              this._whishlistService.setItemsInWhishslist(element);
            });
          }
        }),
        (error) => {
          console.log(error);
        };
    }
    
  }

  addToWhishlist() {
    this._whishlistService.addToWhishlist(this.productInfo);
  }

  removeFromWhishlist(productInfo) {
    this._whishlistService.removeFromWhishlist(productInfo);
  }

  moveToCart(productInfo){
    this._cartService.addToCart(productInfo);
    this._whishlistService.removeFromWhishlist(productInfo);
    this._whishlistService.raiseAlert('The selected item has been moved from Whishlist to Cart');
  }

  showProductDetails(params){
    this._productservice.routeProductDetails(params);
  }

}
