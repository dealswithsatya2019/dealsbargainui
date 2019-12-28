import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { SocialshareComponent } from '../socialshare/socialshare.component';

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
  constructor(private _snackBar: MatSnackBar, private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public dialog: MatDialog, private cartService: CartService,
  ) { }
  subscription: Subscription;
  cname: string = '';
  cdisplayname: string = '';
  cmiddledisplayname: string = '';
  scname: string = '';
  scdisplayname: string = '';
  sub;
  products: any[];
  distinctbrandsArray: Array<string>;
  selectedBrandsArray: Array<string> = [];
  fromPrice: number = 0;
  toPrice: number = 0;
  public snackBarConfig: MatSnackBarConfig;
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;
  public showFilter: boolean = false;
  public scrollableCount: number = 1;
  public isProductList: boolean = true;
  public dealtype: string;


  ngOnInit() {
    this.sub = this._Activatedroute.paramMap.subscribe(params => {
      this.isProductList = params.get('dealtype') == null ? true : false;
      if (!this.isProductList) {
        this.dealtype = params.get('dealtype');
        this.subscription = this._productservice.getHttpProductDealsByType(this.dealtype, 'us', this.scrollableCount, 50).subscribe(
          (results: searchreponse) => {
            this.products = results.responseObjects;
            if (this.products.length > 0) {
              this.cdisplayname = this.products[0].display_name_category;
              this.cmiddledisplayname = this.products[0].display_name_middle_subcategory;
              this.scdisplayname = this.products[0].display_name_subcategory;
            }
          });
      } else {
        this.cname = params.get('cname');
        this.scname = params.get('scname');
        this.subscription = this._productservice.getProductlist(this.cname, this.scname, 'us', this.scrollableCount, 50).subscribe(
          (results: searchreponse) => {
            this.products = results.responseObjects;
            if (this.products.length > 0) {
              this.cdisplayname = this.products[0].display_name_category;
              this.cmiddledisplayname = this.products[0].display_name_middle_subcategory;
              this.scdisplayname = this.products[0].display_name_subcategory;
            }
            this.getDistinctBrands();
          }
        );
      }
    });
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = "center";
    this.snackBarConfig.verticalPosition = "top";
    this.snackBarConfig.duration = 5000;
  }

  public isDataExist: boolean = true;

  public onScroll() {
    console.log("Scrolling downnnnnnnnnnn product list page");
    this.scrollableCount = this.scrollableCount + 1;
    let hotDealsNew: Product[] = [];
    let productstemp: any[];
    if (this.isDataExist) {
      if (this.isProductList) {
        this.subscription = this._productservice.getProductlist(this.cname, this.scname, 'us', this.scrollableCount, 20).subscribe(
          (results: searchreponse) => {
            productstemp = results.responseObjects;
            if (productstemp.length > 0) {
              productstemp.forEach(element => {
                this.products.push(element);
              });
            } else {
              this.isDataExist = false;
            }
            this.getDistinctBrands();
          }
        );
      } else {
        this.subscription = this._productservice.getHttpProductDealsByType(this.dealtype, 'us', this.scrollableCount, 50).subscribe(
          (results: searchreponse) => {
            productstemp = results.responseObjects;
            if (productstemp.length > 0) {
              productstemp.forEach(element => {
                this.products.push(element);
              });
            } else {
              this.isDataExist = false;
            }
          });
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subscription.unsubscribe();
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
    console.log("From Price ",event.value);
    this.fromPrice = event.value;
  }
  updateToPrice(event) {
    console.log("To Price ",event.value);
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
  }

  routeToProductListPage(params) {
    this._productservice.routeProductList(params);
  }
}
