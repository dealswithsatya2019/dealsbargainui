import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialshareComponent } from '../socialshare/socialshare.component';
import { MatDialogConfig, MatDialog, } from '@angular/material';
import { searchreponse } from 'src/app/models/searchResponse';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/models/product';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import { ProductListRouteInfoService } from 'src/app/services/routing-services/product-list-route-info.service';
import { ProductDetailsRouteInfoService } from 'src/app/services/routing-services/product-details-route-info.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})
export class ProductlistComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar,private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public dialog: MatDialog,private cartService: CartService,
    public _productListRouteInfo:ProductListRouteInfoService,
    public _productDetailsRouteInfo:ProductDetailsRouteInfoService
  ) { }
  cname: any;
  scname: any;
  sub;
  products: any[];
  distinctbrandsArray: Array<string>;
  selectedBrandsArray: Array<string> = [];
  fromPrice: number = 0;
  toPrice: number = 0;
  public snackBarConfig : MatSnackBarConfig;

  ngOnInit() {
   /* this.sub = this._Activatedroute.paramMap.subscribe(params => {
      console.log('params' + params);
      this.cname = params.get('cname');
      this.scname = params.get('scname');
      this._productservice.getProductlist(this.cname, this.scname, 'us', 0, 20).subscribe(
        (results: searchreponse) => {
          this.products = results.responseObjects;
          this.getDistinctBrands();
        });
    });*/
    this.cname = this._productListRouteInfo.cname;
    this.scname = this._productListRouteInfo.scname;
    this._productservice.getProductlist(this.cname, this.scname, 'us', 0, 20).subscribe(
      (results: searchreponse) => {
        this.products = results.responseObjects;
        this.getDistinctBrands();
      });
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = "center";
    this.snackBarConfig.verticalPosition = "top";
    this.snackBarConfig.duration = 2000;
  }

  showProductDetails(cname,scname, pid) {
    this._productDetailsRouteInfo.cname = cname;
    this._productDetailsRouteInfo.scname = scname;
    this._productDetailsRouteInfo.productId =pid;
    this._productservice.routeProductDetails();
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

  public addToCart(product: Product) {
    this.cartService.addToCart(product);
    // this._snackBar.open("The item has been added to cart.", "", this.snackBarConfig);
    this._router.navigateByUrl('/mycart');
  }
}
