import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialshareComponent } from '../socialshare/socialshare.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { searchreponse } from 'src/app/models/searchResponse';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})
export class ProductlistComponent implements OnInit {

  constructor(private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public dialog: MatDialog) { }
  cname: any;
  scname: any;
  sub;
  products: any[];
  distinctbrandsArray: Array<string>;
  selectedBrandsArray: Array<string> = [];
  fromPrice: number = 0;
  toPrice: number = 0;

  ngOnInit() {
    this.sub = this._Activatedroute.paramMap.subscribe(params => {
      console.log('params' + params);
      this.cname = params.get('cname');
      this.scname = params.get('scname');
      this._productservice.getProductlist(this.cname, this.scname, 'us', 0, 20).subscribe(
        (results: searchreponse) => {
          this.products = results.responseObjects;
          this.getDistinctBrands();
        });
    });
  }

  showProductDetails(params) {
    this._productservice.routeProductDetails(params);
  }

  getDistinctBrands() {
    this.distinctbrandsArray = this.products.map(item => item.brand_name).filter((value, index, self) => self.indexOf(value) === index)
  }

  refreshBrands(event: any, brand_name) {
    if (event.checked) {
      if (!this.selectedBrandsArray.includes(brand_name)) {
        this.selectedBrandsArray.push(brand_name);
      }
    } else {
      if (this.selectedBrandsArray.includes(brand_name)) {
        this.selectedBrandsArray = this.selectedBrandsArray.filter(item => item !== brand_name);
      }
    }
  }

  updateFromPrice(event) {
    this.fromPrice = event.value;
  }
  updateToPrice(event) {
    this.toPrice = event.value;
  }

  openShare(event: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '200px';
    dialogConfig.height = '150px';
    let x = event.x - 50;
    let y = event.y - 50;
    dialogConfig.position = { left: x + 'px', top: y + "px" };
    this.dialog.open(SocialshareComponent, dialogConfig);
  }
}
