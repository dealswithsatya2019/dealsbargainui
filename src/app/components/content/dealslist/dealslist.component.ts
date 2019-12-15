import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { ProductService } from 'src/app/services/product.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { SocialshareComponent } from '../socialshare/socialshare.component';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-dealslist',
  templateUrl: './dealslist.component.html',
  styleUrls: ['./dealslist.component.scss']
})
export class DealslistComponent implements OnInit {

  constructor(public _productservice: ProductService, public dialog: MatDialog, private _Activatedroute: ActivatedRoute, private cartService: CartService
  ) { }
  public hotDeals: Product[];
  dealtype: any;
  sub: any;
  public whishlist_action_type: string = 'add';
  public dealsSize : number;

  ngOnInit() {
    this.sub = this._Activatedroute.paramMap.subscribe(params => {
      this.dealtype = params.get('dealtype');
    });
    console.log("deal type ", this.dealtype);
    this._productservice.getHttpProductDealsByType(this.dealtype, 'us', 0, 200).subscribe(
      (results: searchreponse) => {
        this.hotDeals = results.responseObjects;
        this.dealsSize = this.hotDeals.length;
      });
  }

  openShare(event: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '200px';
    dialogConfig.height = '200px';
    let x = event.x - 50;
    let y = event.y - 50;
    dialogConfig.position = { left: x + 'px', top: y + "px" };
    this.dialog.open(SocialshareComponent, dialogConfig);
  }

  public addToCart(product: Product) {
    if (product.quantity == 0) {
      product.quantity = 1;
    }
    this.cartService.addToCart(product);
  }

}
