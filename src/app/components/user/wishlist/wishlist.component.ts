import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/models/product';
import { WhishlistService } from 'src/app/services/whishlist.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  @Input() public productInfo: Product;
  @Input() public actionType: string = 'list';
  public itemsInWhishslist: Product[] = [];
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;
  public shoppingCartItems: Product[] = [];
  
  constructor(private _whishlistService: WhishlistService) {
    this._whishlistService.getItems();
  }

  ngOnInit() {
    if (this.actionType === 'list') {
      this._whishlistService.getWhishlist();
    }
  }

  addToWhishlist() {
    this._whishlistService.addToWhishlist(this.productInfo);
  }

  removeFromWhishlist(productInfo) {
    this._whishlistService.removeFromWhishlist(productInfo);
  }

}
