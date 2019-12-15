import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { SocialshareComponent } from './socialshare/socialshare.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Swiper, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/js/swiper.esm.js';
import { CartService } from 'src/app/services/cart.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ProductDetailsRouteInfoService } from 'src/app/services/routing-services/product-details-route-info.service';
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay]);
import { environment } from 'src/environments/environment';
import { ProductRouteInfo } from 'src/app/models/ProductRouteInfo';
import { ProductListRouteInfoService } from 'src/app/services/routing-services/product-list-route-info.service';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})

export class ContentComponent implements AfterViewInit, OnInit {
  public flashDeals: Product[];
  public hotDeals: Product[];
  public todayDeals: Product[];
  public bestSellers: Product[];
  public snackBarConfig: MatSnackBarConfig;
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;
  public whishlist_action_type: string = 'add';
  constructor(private _snackBar: MatSnackBar, private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public dialog: MatDialog, public cart: CartService,
  ) //public _productListRouteInfo:ProductListRouteInfoService
  {
  }


  showProductDetails(params) {
    /*let productRouteInfo: ProductRouteInfo = new ProductRouteInfo(params);
    sessionStorage.setItem("product_details", JSON.stringify(productRouteInfo));
    //this._productListRouteInfo.addToCart(productRouteInfo);*/
    
    this._productservice.routeProductDetails(params);
  }

  ngAfterViewInit() {

    setTimeout(() => {
      var swiper = new Swiper('.flash-deals', {
        autoplay: {
          delay: 3000,
        },
        speed: 500,
        slidesPerView: 1,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      })
    }, 1000);
  }

  ngOnInit() {
    this._productservice.getHttpProductDealsByType('f', 'us', 0, 10).subscribe(
      (results: searchreponse) => {
        this.flashDeals = results.responseObjects;
      });
    this._productservice.getHttpProductDealsByType('h', 'us', 0, 10).subscribe(
      (results: searchreponse) => {
        this.hotDeals = results.responseObjects;
      });
    this._productservice.getHttpProductDealsByType('t', 'us', 0, 10).subscribe(
      (results: searchreponse) => {
        this.todayDeals = results.responseObjects;
      });
    this._productservice.getHttpProductDealsByType('b', 'us', 0, 10).subscribe(
      (results: searchreponse) => {
        this.bestSellers = results.responseObjects;
      });
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = "center";
    this.snackBarConfig.verticalPosition = "top";
    this.snackBarConfig.duration = 2000;
  }

  openShare(event: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '150px';
    dialogConfig.height = '150px';
    let x = event.x - 50;
    let y = event.y - 50;
    dialogConfig.position = { left: x + 'px', top: y + "px" };
    this.dialog.open(SocialshareComponent, dialogConfig);
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }


  public parseToUrl(value: string) {
    if (value != undefined) {
      return encodeURI(value);
    } else {
      return value;
    }
  }

  public addToCart(product: Product) {
    if (product.quantity == 0) {
      product.quantity = 1;
    }
    this.cart.addToCart(product);
  }

}
