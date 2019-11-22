import { Component, OnInit, Input, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { ProductRouteInfo } from 'src/app/models/ProductRouteInfo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})
export class ProductlistComponent implements OnInit, OnDestroy {

/*  constructor(private _snackBar: MatSnackBar,private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public dialog: MatDialog,private cartService: CartService,
    public _productListRouteInfo:ProductListRouteInfoService,
    public _productDetailsRouteInfo:ProductDetailsRouteInfoService
  ) { }*/
  constructor(private _snackBar: MatSnackBar,private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public dialog: MatDialog,private cartService: CartService,
  ) { }
  subscription: Subscription;
  cname: any;
  scname: any;
  sub;
  products: any[];
  distinctbrandsArray: Array<string>;
  selectedBrandsArray: Array<string> = [];
  fromPrice: number = 0;
  toPrice: number = 0;
  public snackBarConfig : MatSnackBarConfig;
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;
  public whishlist_action_type :string;
  //subscription : Subscription;
  ngOnInit() {
   this.sub = this._Activatedroute.paramMap.subscribe(params => {
      //this.cname = params.get('cname');
      //this.scname = params.get('scname');
      
    /*this.subscription = this._productListRouteInfo.getCart().subscribe(productRouteInfo => {
      if (productRouteInfo) {
        this.cname = productRouteInfo.cname;
        this.scname = productRouteInfo.scname;
      }*/
      let menuClickInfo: ProductRouteInfo = JSON.parse(sessionStorage.getItem("product_list"));
      this.cname = menuClickInfo.cname;
      this.scname = menuClickInfo.scname;
      this.subscription = this._productservice.getProductlist(this.cname, this.scname, 'us', 0, 20).subscribe(
        (results: searchreponse) => {
          this.products = results.responseObjects;
          this.getDistinctBrands();
        });
     // });
    });

    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = "center";
    this.snackBarConfig.verticalPosition = "top";
    this.snackBarConfig.duration = 2000;
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
    this.subscription.unsubscribe();
  }

  showProductDetails(params) {
    let productRouteInfo: ProductRouteInfo = new ProductRouteInfo(params.cname,params.scname,params.pid);
    sessionStorage.setItem("product_details", JSON.stringify(productRouteInfo));
    //this._productListRouteInfo.addToCart(productRouteInfo);
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

  public addToCart(product: Product) {
    this.cartService.addToCart(product);
    // this._snackBar.open("The item has been added to cart.", "", this.snackBarConfig);
    // this._router.navigateByUrl('/mycart');
  }
}
